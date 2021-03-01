import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';
import { UserRole } from '../enums/user-role';

@ObjectType()
@Schema({ timestamps: true })
export class User extends BaseEntity {
  @Prop()
  @Field()
  email: string;

  @Prop()
  @Field()
  name: string;

  @Prop({
    enum: UserRole,
    default: UserRole.REGULAR
  })
  @Field(() => UserRole)
  role: UserRole;

  public isAdmin?(): boolean
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.isAdmin = function () {
  return this.role === UserRole.ADMIN;
};
