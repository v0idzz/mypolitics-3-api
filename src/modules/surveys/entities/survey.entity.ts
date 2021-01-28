import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, SchemaFactory, Schema, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';
import { Schema as MongoSchema } from 'mongoose';
import { QuizVersion } from '../../quiz-versions/entities/quiz-version.entity';
import { SurveyAnswer } from './survey-answer.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Survey extends BaseEntity {
  @Prop(raw([SurveyAnswer]))
  @Field(() => [SurveyAnswer])
  answers: SurveyAnswer[];

  @Prop(Boolean)
  @Field(() => Boolean)
  finished: boolean;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'QuizVersion' })
  @Field(() => QuizVersion)
  quizVersion: QuizVersion;
}

export type SurveyDocument = Survey & Document;
export const SurveySchema = SchemaFactory.createForClass(Survey);
