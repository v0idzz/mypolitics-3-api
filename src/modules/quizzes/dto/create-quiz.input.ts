import { Field, InputType } from '@nestjs/graphql';
import { TextTranslationInput } from '../../../shared/entities/text-translation.entity';

@InputType()
export class CreateQuizInput {
  @Field(() => String)
  slug: string;

  @Field(() => TextTranslationInput)
  title: TextTranslationInput;

  @Field(() => TextTranslationInput)
  description: TextTranslationInput;
}
