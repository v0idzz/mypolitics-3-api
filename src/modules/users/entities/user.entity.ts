import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';
import { UserRole } from '../enums/user-role';
import * as bcrypt from 'bcrypt';
import * as mongoose from "mongoose";

@ObjectType()
@Schema({ timestamps: true })
export class User extends BaseEntity {
  @Prop()
  @Field()
  email: string;

  @Prop(mongoose.Schema.Types.Boolean)
  @Field(() => Boolean)
  emailVerified: boolean;

  @Prop()
  @Field()
  name: string;

  @Prop()
  password?: string;

  @Prop({
    enum: UserRole,
    default: UserRole.REGULAR
  })
  @Field(() => UserRole)
  role: UserRole;

  public isAdmin?(): boolean
  public compareHash?(password: string): Promise<boolean>
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.isAdmin = function () {
  return this.role === UserRole.ADMIN;
};

UserSchema.methods.compareHash = async function (password: string) {
  return bcrypt.compare(password, this.password);
};
