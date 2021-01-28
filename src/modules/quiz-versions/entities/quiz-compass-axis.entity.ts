import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TextTranslation } from '../../../shared/entities/text-translation.entity';
import { QuizCompassIdeology } from './quiz-compass-ideology.entity';

@ObjectType()
@Schema()
export class QuizCompassAxis {
  @Prop(raw(TextTranslation))
  @Field(() => TextTranslation)
  name?: TextTranslation;

  @Prop(raw([QuizCompassIdeology]))
  @Field(() => [QuizCompassIdeology])
  ideologies?: QuizCompassIdeology[];
}

export const QuizCompassAxisSchema = SchemaFactory.createForClass(QuizCompassAxis);
