import { Field, InputType } from '@nestjs/graphql';
import { TextTranslationInput } from '../../../shared/entities/text-translation.entity';
import { QuizMetaInput } from './quiz-meta.input';

@InputType()
export class CreateQuizInput {
  @Field(() => String)
  slug: string;

  @Field(() => String)
  logoUrl: string;

  @Field(() => TextTranslationInput)
  title: TextTranslationInput;

  @Field(() => TextTranslationInput)
  description: TextTranslationInput;

  @Field(() => QuizMetaInput)
  meta: QuizMetaInput;
}
