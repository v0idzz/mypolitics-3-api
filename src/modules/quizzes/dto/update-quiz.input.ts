import { Field, InputType } from '@nestjs/graphql';
import { TextTranslationInput } from '../../../shared/entities/text-translation.entity';
import { QuizVersion } from '../../quiz-versions/entities/quiz-version.entity';
import { QuizMetaInput } from './quiz-meta.input';

@InputType()
export class UpdateQuizInput {
  @Field(() => TextTranslationInput, { nullable: true })
  title?: TextTranslationInput;

  @Field(() => String)
  logoUrl?: string;

  @Field(() => TextTranslationInput, { nullable: true })
  description?: TextTranslationInput;

  @Field(() => String, { nullable: true })
  currentVersion?: QuizVersion;

  @Field(() => QuizMetaInput)
  meta?: QuizMetaInput;
}
