import { Field, InputType } from '@nestjs/graphql';
import { QuestionPositiveEffectInput } from './question-positive-effect.input';

@InputType()
export class QuestionEffectsInput {
  @Field(() => QuestionPositiveEffectInput)
  agree: QuestionPositiveEffectInput;

  @Field(() => QuestionPositiveEffectInput)
  disagree: QuestionPositiveEffectInput;
}
