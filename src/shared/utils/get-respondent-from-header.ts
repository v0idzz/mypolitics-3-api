import { Headers } from '../../constants';
import { Respondent } from '../../modules/respondents/entities/respondent.entity';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

export const getRespondentFromHeader = (host: HttpArgumentsHost): Respondent | null => {
  const req = host.getRequest();
  const respondentHeader = req.headers[Headers.RESPONDENT];
  if (!respondentHeader || typeof respondentHeader !== 'string') {
    return null;
  }

  return JSON.parse(Buffer.from(respondentHeader, 'base64').toString());
};
