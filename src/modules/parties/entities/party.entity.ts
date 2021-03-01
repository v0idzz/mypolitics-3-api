import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';
import { Country } from '../../../shared/enums/country.enum';
import * as mongoose from 'mongoose';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Party extends BaseEntity {
  @Prop()
  @Field(() => String)
  name: string;

  @Prop()
  @Field()
  logoUrl: string;

  @Prop(mongoose.Schema.Types.String)
  @Field(() => Country)
  country: Country;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  @Field(() => [User])
  authors: User[];

  public isAuthor?(user: User): boolean
}

export type PartyDocument = Party & Document;
export const PartySchema = SchemaFactory.createForClass(Party);

PartySchema.methods.isAuthor = function (user: User) {
  const authorsIds: string = this['_doc'].authors;
  return authorsIds.includes(user._id);
};
