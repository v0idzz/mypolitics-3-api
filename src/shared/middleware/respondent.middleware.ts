import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Headers, Cookies as ConstCookies } from '../../constants';
import Cookies from 'cookies';
import parser from 'accept-language-parser';
import { RespondentsService } from '../../modules/respondents/respondents.service';
import { Language } from '../enums/language.enum';
import dayjs from 'dayjs';

@Injectable()
export class RespondentMiddleware implements NestMiddleware {
  constructor(private respondentsService: RespondentsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const cookies = new Cookies(req, res);
    const respondentHeader = req.headers[Headers.RESPONDENT];
    const respondentCookie = cookies.get(ConstCookies.RESPONDENT);
    let respondentData = respondentHeader || respondentCookie;

    if (!respondentData || typeof respondentData !== 'string') {
      const languages = [Language.ENGLISH, Language.POLISH];
      const acceptLanguage = req.headers['accept-language'];
      const userAgent = req.headers['user-agent'];
      if (userAgent.includes('node-fetch')) {
        next();
        return;
      }

      const lang = parser.pick(languages, acceptLanguage);
      const code = await this.respondentsService.generateCode(lang);
      const respondent = await this.respondentsService.createOne({ code, surveys: [] });
      const { _id } = respondent;
      respondentData = Buffer.from(JSON.stringify({ _id })).toString('base64');
      cookies.set(ConstCookies.RESPONDENT, respondentData, {
        expires: dayjs().add(3, 'month').toDate(),
      });
    }

    const respondentObject = Buffer.from(respondentData, 'base64').toString();
    req['respondent'] = JSON.parse(respondentObject);
    next();
  }
}
