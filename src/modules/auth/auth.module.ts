import { forwardRef, HttpModule, Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import authConfig from '../../config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { ActionToken, ActionTokenSchema } from './entities/action-token.entity';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    PassportModule,
    ConfigModule.forFeature(authConfig),
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ActionToken.name, schema: ActionTokenSchema },
    ], 'main'),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authConfig)],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwt.secret'),
        signOptions: {
          expiresIn: configService.get<number>('auth.jwt.expiresIn'),
        }
      }),
      inject: [ConfigService]
    }),
  ],
  providers: [
    FacebookStrategy, ConfigService, UsersService,
    Logger, AuthService, JwtStrategy, LocalStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
