import { Controller, Get, UseGuards, HttpStatus, Req, Res, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import Cookies from 'cookies';
import { Cookies as ConstCookies } from '../../constants';
import dayjs from 'dayjs';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ){}

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<any> {
    const cookies = new Cookies(req, res);
    const token = await this.authService.createAndGetAccessToken(req.user as User);
    cookies.set(ConstCookies.JWT, token, {
      httpOnly: true,
      expires: dayjs().add(7, 'day').toDate(),
    });

    res.redirect('/');
  }

  @Get('verify')
  async verifyUser(
    @Res() res: Response,
    @Query() { code, userId }: {
      code: string;
      userId: string;
    }
  ): Promise<any> {
    const verified = this.authService.verifyActionToken(code, userId);

    if (verified) {
      res.redirect('/');
    }
  }
}
