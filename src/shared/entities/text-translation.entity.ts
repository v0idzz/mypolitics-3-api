import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Language } from '../enums/language.enum';

@ObjectType()
export class TextTranslation {
  @Field({ name: Language.POLISH, nullable: true })
  pl?: string;

  @Field({ name: Language.ENGLISH, nullable: true })
  en?: string;

  @Field({ name: Language.SERBIAN, nullable: true })
  sr?: string;
}

@InputType()
export class TextTranslationInput implements TextTranslation {
  @Field({ name: Language.POLISH, nullable: true })
  pl?: string;

  @Field({ name: Language.ENGLISH, nullable: true })
  en?: string;

  @Field({ name: Language.SERBIAN, nullable: true })
  sr?: string;
}
