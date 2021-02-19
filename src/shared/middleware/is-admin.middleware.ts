import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Headers } from '../../constants';

@Injectable()
export class IsAdminMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const adminHeader = req.headers[Headers.ADMIN];
    if (!adminHeader || typeof adminHeader !== 'string') {
      req['isAdmin'] = false;

      next();
      return;
    }

    req['isAdmin'] = adminHeader === process.env.ADMIN_CODE;
    next();
  }
}
