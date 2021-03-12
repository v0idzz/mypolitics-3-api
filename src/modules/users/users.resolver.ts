import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { AuthService } from '../auth/auth.service';
import { CreateUserInput } from './dto/create-user.input';
import { UserRole } from './enums/user-role';
import { LoginUserInput } from './dto/login-user.input';
import { ErrorCode } from '../../types';
import { Cookies, ErrorsMessages } from '../../constants';
import * as bcrypt from 'bcrypt';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { ActionTokenType } from '../auth/enums/action-token-type.enum';
import dayjs from 'dayjs';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async me(@CurrentUser() user: User) {
    return user;
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') { recaptcha, ...createUserInput }: CreateUserInput,
  ): Promise<User> {
    const captchaValid = await this.authService.validateReCaptcha(recaptcha);
    if (!captchaValid) {
      throw new BadRequestException();
    }

    const userExists = await this.usersService.findOne({ email: createUserInput.email });
    if (userExists) {
      throw new BadRequestException(ErrorsMessages[ErrorCode.USER_EXISTS]);
    }

    createUserInput.password = await bcrypt.hash(createUserInput.password, 10);

    const user = await this.usersService.createOne({
      ...createUserInput,
      role: UserRole.REGULAR,
      emailVerified: false,
    });

    const token = await this.authService.createAndGetActionToken(user, ActionTokenType.VERIFY_EMAIL);
    await this.authService.sendEmailConfirm(user, token);

    return user;
  }

  @Mutation(() => User)
  async loginUser(
    @Args('loginUserInput') { recaptcha, email, password }: LoginUserInput,
    @Context() { res }: ExpressContext
  ): Promise<User> {
    const captchaValid = await this.authService.validateReCaptcha(recaptcha);
    if (!captchaValid) {
      throw new BadRequestException();
    }

    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new BadRequestException(ErrorsMessages[ErrorCode.WRONG_CREDENTIALS]);
    }

    const validCredentials = await user.compareHash(password);
    if (!validCredentials) {
      throw new BadRequestException(ErrorsMessages[ErrorCode.WRONG_CREDENTIALS]);
    }

    if (!user.emailVerified) {
      const lastToken = await this.authService.actionTokensService.findOne(
        { user },
        {},
        { sort: 1 },
      );
      const lastTokenValid = dayjs(lastToken?.expiresOn).isAfter(dayjs());

      if (lastTokenValid) {
        throw new BadRequestException(ErrorsMessages[ErrorCode.EMAIL_NOT_VERIFIED_SENT_IN_15_MIN]);
      }

      const token = await this.authService.createAndGetActionToken(user, ActionTokenType.VERIFY_EMAIL);
      await this.authService.sendEmailConfirm(user, token);
      throw new BadRequestException(ErrorsMessages[ErrorCode.EMAIL_NOT_VERIFIED_SENT_NOW]);
    }

    const token = await this.authService.createAndGetAccessToken(user);
    const expiresIn = 60 * 60 * 24 * 7 ; // 1 week

    res.cookie(Cookies.JWT, token, {
      maxAge: expiresIn,
      secure: process.env.NODE_ENV === 'production',
    });

    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async logoutMe(
    @Context() { res }: ExpressContext
  ): Promise<boolean> {
    res.clearCookie(Cookies.JWT);

    return true;
  }
}
