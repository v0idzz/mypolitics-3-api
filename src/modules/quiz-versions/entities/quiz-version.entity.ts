import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';
import { QuizAxis } from './quiz-axis.entity';
import { Question } from '../../questions/entities/question.entity';
import { QuizCompassMode } from './quiz-compass-mode.entity';
import { Ideology } from '../../ideologies/entities/ideology.entity';

@ObjectType()
@Schema({ timestamps: true })
export class QuizVersion extends BaseEntity {
  @Prop(String)
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

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Ideology' }] })
  @Field(() => [Ideology], { nullable: 'items' })
  traits: Ideology[];
}

export type QuizVersionDocument = QuizVersion & Document;
export const QuizVersionSchema = SchemaFactory.createForClass(QuizVersion);
