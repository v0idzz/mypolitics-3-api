import { Ideology } from '../../ideologies/entities/ideology.entity';
import { Field, InputType, Int } from '@nestjs/graphql';
import { TextTranslationInput } from '../../../shared/entities/text-translation.entity';

@InputType()
export class QuizCompassIdeologyInput {
  @Field(() => String)
  ideology: Ideology;

  @Field(() => Int)
  weight: number;
}

@InputType()
export class QuizCompassAxisInput {
  @Field(() => TextTranslationInput, { nullable: true })
  name?: TextTranslationInput;

  @Field(() => [QuizCompassIdeologyInput])
  leftIdeologies?: QuizCompassIdeologyInput[];

  @Field(() => [QuizCompassIdeologyInput])
  rightIdeologies?: QuizCompassIdeologyInput[];
}

@InputType()
export class QuizCompassModeInput {
  @Field(() => TextTranslationInput)
  name: TextTranslationInput;

  @Field(() => QuizCompassAxisInput)
  horizontal: QuizCompassAxisInput;

  @Field(() => QuizCompassAxisInput)
  vertical: QuizCompassAxisInput;

  @Field(() => QuizCompassAxisInput, { nullable: true })
  third?: QuizCompassAxisInput;
}
