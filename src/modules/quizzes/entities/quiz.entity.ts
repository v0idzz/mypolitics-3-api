import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';
import { TextTranslation } from '../../../shared/entities/text-translation.entity';
import { QuizVersion } from '../../quiz-versions/entities/quiz-version.entity';
import * as mongoose from 'mongoose';
import { QuizMeta } from './quiz-meta.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Quiz extends BaseEntity {
  @Prop()
  @Field(() => String)
  slug: string;

  @Prop()
  @Field(() => String)
  logoUrl: string;

  @Prop(raw(TextTranslation))
  @Field(() => TextTranslation)
  title: TextTranslation;

  @Prop(raw(TextTranslation))
  @Field(() => TextTranslation)
  description: TextTranslation;

  @Prop(raw(QuizMeta))
  @Field(() => QuizMeta)
  meta: QuizMeta;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'QuizVersion' })
  @Field(() => QuizVersion)
  currentVersion: QuizVersion;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'QuizVersion' }] })
  @Field(() => [QuizVersion], { nullable: 'items' })
  versions: QuizVersion[];
}

export type QuizDocument = Quiz & Document;
export const QuizSchema = SchemaFactory.createForClass(Quiz);
