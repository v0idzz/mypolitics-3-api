import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Survey extends BaseEntity {
  @Prop([Number])
  @Field(() => [Int])
  answers: number[];

  @Prop(Boolean)
  @Field(() => Boolean)
  finished: boolean;
}

export type SurveyDocument = Survey & Document;
export const SurveySchema = SchemaFactory.createForClass(Survey);
