import { Field, ObjectType } from '@nestjs/graphql';
import { Language } from '../enums/language.enum';

@ObjectType()
export class TextTranslation {
  @Field({ name: Language.POLISH })
  pl: string;

  @Field({ name: Language.ENGLISH })
  en: string;
}
