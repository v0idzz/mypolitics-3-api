import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { UserRole } from '../../users/enums/user-role';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      ...configService.get('auth.strategies.facebook'),
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { name, emails } = profile;
    const email = emails[0].value;

    let user = await this.usersService.findOneOrNull({ email });

    if (!user) {
      const userData: User = {
        name: `${name.givenName} ${name.familyName}`,
        role: UserRole.REGULAR,
        email,
      };

      user = await this.usersService.createOne(userData);
    }

    return user;
  }
}
