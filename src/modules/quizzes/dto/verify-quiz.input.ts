import { Field, InputType } from '@nestjs/graphql';
import { QuizVerificationState } from '../enums/quiz-verification-state.enum';

@InputType()
export class VerifyQuizInput {
  @Field(() => QuizVerificationState)
  state: QuizVerificationState;

  @Field(() => String)
  reason: string;
}
