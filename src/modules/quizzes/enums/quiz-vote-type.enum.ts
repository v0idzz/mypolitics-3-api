import { registerEnumType } from '@nestjs/graphql';

export enum QuizVoteType {
  FOR = 'FOR',
  AGAINST = 'AGAINST',
}

registerEnumType(QuizVoteType, {
  name: 'QuizVoteType',
});
