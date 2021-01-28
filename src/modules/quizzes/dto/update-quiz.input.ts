import { Field, InputType } from '@nestjs/graphql';
import { TextTranslationInput } from '../../../shared/entities/text-translation.entity';
import { QuizVersion } from '../../quiz-versions/entities/quiz-version.entity';

@InputType()
export class UpdateQuizInput {
  @Field(() => TextTranslationInput, { nullable: true })
  title?: TextTranslationInput;

  @Field(() => TextTranslationInput, { nullable: true })
  description?: TextTranslationInput;

  @Field(() => String, { nullable: true })
  currentVersion?: QuizVersion;
}
