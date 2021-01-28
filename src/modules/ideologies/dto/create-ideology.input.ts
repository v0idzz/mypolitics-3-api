import { Field, InputType } from '@nestjs/graphql';
import { TextTranslationInput } from '../../../shared/entities/text-translation.entity';
import { IdeologyIconInput } from './ideology-icon.input';

@InputType()
export class CreateIdeologyInput {
  @Field(() => TextTranslationInput)
  name: TextTranslationInput;

  @Field(() => TextTranslationInput)
  description: TextTranslationInput;

  @Field()
  color: string;

  @Field(() => IdeologyIconInput)
  icon: IdeologyIconInput;
}
