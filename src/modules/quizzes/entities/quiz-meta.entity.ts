import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Party } from '../../parties/entities/party.entity';
import { QuizLicense } from '../enums/quiz-license.enum';
import { Types } from 'mongoose';
import * as mongoose from "mongoose";

@ObjectType()
@Schema()
class QuizFeatures {
  @Field(() => Boolean)
  compass?: boolean;

  @Field(() => Boolean)
  traits?: boolean;

  @Field(() => Int)
  axesNumber?: number;

  @Field(() => Int)
  questionsNumber?: number;

  @Prop(mongoose.Schema.Types.Boolean)
  @Field(() => Boolean)
  parties: boolean;

  @Prop(mongoose.Schema.Types.Boolean)
  @Field(() => Boolean)
  politiciansResults: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Party' }] })
  @Field(() => [Party], { nullable: 'items' })
  authorizedParties: Party[];
}

@ObjectType()
@Schema()
class QuizStatistics {
  @Prop(mongoose.Schema.Types.Number)
  @Field(() => Int)
  surveysNumber: number;
}

@ObjectType()
@Schema()
class QuizAuthor {
  @Prop()
  @Field(() => String)
  name: string;

  @Prop()
  @Field(() => String)
  url: string;
}

@ObjectType()
@Schema()
export class QuizMeta {
  @Prop(raw(QuizFeatures))
  @Field(() => QuizFeatures)
  features: QuizFeatures;

  @Prop(raw(QuizStatistics))
  @Field(() => QuizStatistics)
  statistics: QuizStatistics;

  @Prop(raw(QuizAuthor))
  @Field(() => QuizAuthor)
  author: QuizAuthor;

  @Prop(mongoose.Schema.Types.String)
  @Field(() => QuizLicense)
  license: QuizLicense;
}

export const QuizMetaSchema = SchemaFactory.createForClass(QuizMeta);
