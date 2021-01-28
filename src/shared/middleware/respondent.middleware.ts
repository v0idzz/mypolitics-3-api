import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Headers } from '../../constants';

@Injectable()
export class RespondentMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const respondentHeader = req.headers[Headers.RESPONDENT];
    if (!respondentHeader || typeof respondentHeader !== 'string') {
      next();
      return;
    }

    const respondentObject = Buffer.from(respondentHeader, 'base64').toString();
    req['respondent'] = JSON.parse(respondentObject);
    next();
  }
}
