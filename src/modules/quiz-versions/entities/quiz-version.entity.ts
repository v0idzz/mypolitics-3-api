import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';
import { QuizAxis } from './quiz-axis.entity';
import { Question } from '../../questions/entities/question.entity';
import { QuizCompassMode } from './quiz-compass-mode.entity';

@ObjectType()
@Schema({ timestamps: true })
export class QuizVersion extends BaseEntity {
  @Prop(Date)
  @Field(() => GraphQLISODateTime, { nullable: true })
  publishedOn?: string;

  @Prop(raw([QuizAxis]))
  @Field(() => [QuizAxis], { nullable: 'items' })
  axes: QuizAxis[];

  @Prop({ type: Types.ObjectId, ref: 'QuizVersion' })
  @Field(() => QuizVersion, { nullable: true })
  parent?: QuizVersion;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Question' }] })
  @Field(() => [Question], { nullable: 'items' })
  questions: Question[];

  @Prop(raw([QuizCompassMode]))
  @Field(() => [QuizCompassMode], { nullable: 'items' })
  compassModes: QuizCompassMode[];
}

export type QuizVersionDocument = QuizVersion & Document;
export const QuizVersionSchema = SchemaFactory.createForClass(QuizVersion);
