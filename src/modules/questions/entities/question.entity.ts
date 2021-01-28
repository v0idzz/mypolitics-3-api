import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';
import { TextTranslation } from '../../../shared/entities/text-translation.entity';
import { QuestionEffects } from './question-effects.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Question extends BaseEntity {
  @Prop(raw(TextTranslation))
  @Field(() => TextTranslation)
  text: TextTranslation;

  @Prop(raw(QuestionEffects))
  @Field(() => QuestionEffects)
  effects: QuestionEffects;
}

export type QuestionDocument = Question & Document;
export const QuestionSchema = SchemaFactory.createForClass(Question);
