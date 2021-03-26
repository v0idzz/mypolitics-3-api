import { Field, InputType } from '@nestjs/graphql';
import { TextTranslationInput } from '../../../shared/entities/text-translation.entity';
import { Language } from '../../../shared/enums/language.enum';

@InputType()
export class CreateQuizInput {
  @Field(() => String)
  logoUrl: string;

  @Field(() => TextTranslationInput)
  title: TextTranslationInput;

  @Field(() => TextTranslationInput)
  description: TextTranslationInput;

  @Field(() => [Language])
  languages: Language[];
}
