import { Field, InputType } from '@nestjs/graphql';
import { TextTranslationInput } from '../../../shared/entities/text-translation.entity';
import { QuizVersion } from '../../quiz-versions/entities/quiz-version.entity';
import { QuizVerificationState } from '../enums/quiz-verification-state.enum';

@InputType()
export class VerifyQuizInput {
  @Field(() => QuizVerificationState)
  state: QuizVerificationState;

  @Field(() => String)
  reason: string;
}
