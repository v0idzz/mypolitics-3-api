import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TextTranslation } from '../../../shared/entities/text-translation.entity';
import { QuizCompassAxis } from './quiz-compass-axis.entity';

@ObjectType()
@Schema()
export class QuizCompassMode {
  @Prop(raw(TextTranslation))
  @Field(() => TextTranslation, { nullable: true })
  name: TextTranslation;

  @Prop(raw(QuizCompassAxis))
  @Field(() => QuizCompassAxis)
  horizontal: QuizCompassAxis;

  @Prop(raw(QuizCompassAxis))
  @Field(() => QuizCompassAxis)
  vertical: QuizCompassAxis;

  @Prop(raw(QuizCompassAxis))
  @Field(() => QuizCompassAxis, { nullable: true })
  third?: QuizCompassAxis;
}

export const QuizCompassModeSchema = SchemaFactory.createForClass(QuizCompassMode);
