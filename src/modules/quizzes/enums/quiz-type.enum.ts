import { registerEnumType } from '@nestjs/graphql';

export enum QuizType {
  OFFICIAL = 'OFFICIAL',
  COMMUNITY = 'COMMUNITY',
  CLASSIC = 'CLASSIC',
}

registerEnumType(QuizType, {
  name: 'QuizType',
});
