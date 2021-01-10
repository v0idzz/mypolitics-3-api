import { InputType, Field } from '@nestjs/graphql';
import { Language } from '../../../shared/enums/language.enum';

@InputType()
export class CreateRespondentInput {
  @Field(() => Language)
  lang: Language;
}
