import { Field, InputType } from '@nestjs/graphql';
import { QuizAxisInput } from './quiz-axis.input';
import { QuizAxis } from '../entities/quiz-axis.entity';
import { QuizVersion } from '../entities/quiz-version.entity';
import { QuizCompassModeInput } from './quiz-compass-mode.input';

@InputType()
export class CreateQuizVersionInput {
  @Field({ nullable: true })
  publishedOn?: string;

  @Field(() => [QuizAxisInput], { nullable: 'items' })
  axes: QuizAxis[];

  @Field(() => String, { nullable: true })
  parent?: QuizVersion;

  @Field(() => [QuizCompassModeInput], { nullable: 'items' })
  compassModes?: QuizCompassModeInput[];
}
