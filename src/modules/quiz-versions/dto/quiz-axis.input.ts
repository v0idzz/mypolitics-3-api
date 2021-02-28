import { Field, InputType } from '@nestjs/graphql';
import { TextTranslationInput } from '../../../shared/entities/text-translation.entity';

@InputType()
export class QuizAxisInput {
  @Field(() => TextTranslationInput, { nullable: true })
  name?: TextTranslationInput;

  @Field(() => String, { nullable: true })
  left: string;

  @Field(() => String, { nullable: true })
  right: string;
}
