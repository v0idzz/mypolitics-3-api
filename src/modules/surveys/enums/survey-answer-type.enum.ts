import { registerEnumType } from '@nestjs/graphql';

export enum SurveyAnswerType {
  NEUTRAL = 'NEUTRAL',
  AGREE = 'AGREE',
  DISAGREE = 'DISAGREE',
}

registerEnumType(SurveyAnswerType, {
  name: 'SurveyAnswerType',
});
