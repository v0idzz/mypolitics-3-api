import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, HttpService, Injectable, Logger } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Cookies } from '../../constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActionToken, ActionTokenDocument } from './entities/action-token.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { nanoid } from 'nanoid';
import { ActionTokenType } from './enums/action-token-type.enum';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly logger: Logger,
    private readonly mailerService: MailerService,
    @InjectModel(ActionToken.name)
    public readonly actionTokensService: Model<ActionTokenDocument>
  ) {}

  private readonly RECAPTCHA_API_URL = 'https://www.google.com/recaptcha/api/siteverify';

  async validateReCaptcha(recaptcha: string): Promise<boolean> {
    const data = {
      response: recaptcha,
      secret: process.env.NODE_ENV === 'production'
        ? this.configService.get<string>('auth.recaptcha')
        : '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
    };

    const request = `${this.RECAPTCHA_API_URL}?secret=${data.secret}&response=${data.response}`;
    const result = await this.httpService.get(request).toPromise();

    return !!result.data.success;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOne({ email });
    if (user && await user.compareHash(password)) {
      return user;
    }

    return null;
  }

  async createAndGetAccessToken(user: User) {
    const expiresIn = `${this.configService.get<number>('auth.jwt.expiresIn')}s`;
    const payload: JwtPayload = {
      email: user.email,
      sub: user._id
    };

    return this.jwtService.sign(payload, { expiresIn });
  }

  async createAndGetActionToken(user: User, type: ActionTokenType) {
    const code = nanoid(32);
    const expiresIn = 60 * 15;
    const expiresOn = dayjs().add(expiresIn, 'second').toISOString();

    const token: ActionToken = {
      code,
      user,
      expiresOn,
      type,
    };

    return this.actionTokensService.create(token);
  }

  async sendEmailConfirm({ _id: userId, email, name }: User, { code }: ActionToken) {
    return this
      .mailerService
      .sendMail({
        to: email,
        subject: `${name}, confirm your e-mail address on myPolitics`,
        template: 'email-confirm',
        context: {
          name,
          code,
          userId
        },
      });
  }

  async verifyActionToken(code: string, userId: string) {
    const user = await this.usersService.findOne({ _id: userId });
    const token = await this.actionTokensService.findOne({
      code,
      user,
    });
    const valid = dayjs(token?.expiresOn).isAfter(dayjs());

    if (!token || !valid) {
      throw new ForbiddenException();
    }

    await user.updateOne({
      emailVerified: true
    });

    return true;
  }
}
