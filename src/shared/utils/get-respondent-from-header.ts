import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { Headers } from '../../constants';
import { Respondent } from '../../modules/respondents/entities/respondent.entity';

export const getRespondentFromHeader = (context: ExpressContext): Respondent | null => {
  const respondentHeader = context.req.headers[Headers.RESPONDENT];
  if (!respondentHeader || typeof respondentHeader !== 'string') {
    return null;
  }

  return JSON.parse(Buffer.from(respondentHeader, 'base64').toString());
};
