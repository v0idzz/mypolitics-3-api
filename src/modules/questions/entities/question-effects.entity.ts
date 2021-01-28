import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { QuestionPositiveEffect } from './question-positive-effect.entity';

@ObjectType()
@Schema()
export class QuestionEffects {
  @Prop(raw(QuestionPositiveEffect))
  @Field(() => QuestionPositiveEffect)
  agree: QuestionPositiveEffect;

  @Prop(raw(QuestionPositiveEffect))
  @Field(() => QuestionPositiveEffect)
  disagree: QuestionPositiveEffect;
}

export const QuestionEffectsSchema = SchemaFactory.createForClass(QuestionEffects);
