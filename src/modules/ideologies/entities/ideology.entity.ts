import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';
import { TextTranslation } from '../../../shared/entities/text-translation.entity';
import { IdeologyIcon } from './ideology-icon.entity';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Ideology extends BaseEntity {
  @Prop(raw(TextTranslation))
  @Field(() => TextTranslation)
  name: TextTranslation;

  @Prop(raw(TextTranslation))
  @Field(() => TextTranslation)
  description: TextTranslation;

  @Prop()
  @Field()
  color: string;

  @Prop(raw(IdeologyIcon))
  @Field(() => IdeologyIcon)
  icon: IdeologyIcon;

  @Field(() => Boolean)
  viewerCanEdit?: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  @Field(() => [User])
  authors: User[];

  public isAuthor?(user: User): boolean
}

export type IdeologyDocument = Ideology & Document;
export const IdeologySchema = SchemaFactory.createForClass(Ideology);

IdeologySchema.methods.isAuthor = function (user: User) {
  const authorsIds: string = this['_doc'].authors;
  return authorsIds.includes(user._id);
};
