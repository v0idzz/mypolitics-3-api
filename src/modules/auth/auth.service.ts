import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createAndGetAccessToken(user: User) {
    const expiresIn = `${this.configService.get<number>('auth.jwt.expiresIn')}s`;
    const payload: JwtPayload = {
      email: user.email,
      sub: user._id
    };

    return this.jwtService.sign(payload, { expiresIn });
  }
}
