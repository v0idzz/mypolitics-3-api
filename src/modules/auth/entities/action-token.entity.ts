import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';
import * as mongoose from 'mongoose';
import { ActionTokenType } from '../enums/action-token-type.enum';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Schema({ timestamps: true })
export class ActionToken extends BaseEntity {
  @Prop()
  code: string;

  @Prop(mongoose.Schema.Types.String)
  expiresOn?: string;

  @Prop({ enum: ActionTokenType })
  type: ActionTokenType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Field(() => User)
  user: User;
}

export type ActionTokenDocument = ActionToken & Document;
export const ActionTokenSchema = SchemaFactory.createForClass(ActionToken);
