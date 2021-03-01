import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';
import { TextTranslation } from '../../../shared/entities/text-translation.entity';
import { QuestionEffects } from './question-effects.entity';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Question extends BaseEntity {
  @Prop(raw(TextTranslation))
  @Field(() => TextTranslation)
  text: TextTranslation;

  @Prop(raw(QuestionEffects))
  @Field(() => QuestionEffects)
  effects: QuestionEffects;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  @Field(() => [User])
  authors: User[];

  public isAuthor?(user: User): boolean
}

export type QuestionDocument = Question & Document;
export const QuestionSchema = SchemaFactory.createForClass(Question);

QuestionSchema.methods.isAuthor = function (user: User) {
  const authorsIds: string = this['_doc'].authors;
  return authorsIds.includes(user._id);
};
