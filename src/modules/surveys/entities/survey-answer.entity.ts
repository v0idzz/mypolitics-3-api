import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';
import { Schema as MongoSchema } from 'mongoose';
import { Question } from '../../questions/entities/question.entity';
import { SurveyAnswerType } from '../anums/survey-answer-type.enum';
import * as mongoose from "mongoose";

@ObjectType()
@Schema({ timestamps: true })
export class SurveyAnswer extends BaseEntity {
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Question' })
  @Field(() => Question)
  question: Question;

  @Prop(mongoose.Schema.Types.String)
  @Field(() => SurveyAnswerType)
  type: SurveyAnswerType;

  @Prop(mongoose.Schema.Types.Number)
  @Field(() => Number)
  weight: number;
}

export const SurveyAnswerSchema = SchemaFactory.createForClass(SurveyAnswer);
