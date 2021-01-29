import { registerEnumType } from '@nestjs/graphql';

export enum QuizLicense {
  COMMERCIAL = 'COMMERCIAL',
  MIT = 'MIT',
}

registerEnumType(QuizLicense, {
  name: 'QuizLicense',
});
