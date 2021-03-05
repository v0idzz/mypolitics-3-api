import { registerEnumType } from '@nestjs/graphql';

export enum QuizVerificationState {
  IDLE = 'IDLE',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

registerEnumType(QuizVerificationState, {
  name: 'QuizVerificationState',
});
