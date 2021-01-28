import { createParamDecorator } from '@nestjs/common';
import { Respondent } from '../../modules/respondents/entities/respondent.entity';

export const CurrentRespondent = createParamDecorator(
  (_, [root, args, ctx, info]): Respondent => ctx.req.respondent
);
