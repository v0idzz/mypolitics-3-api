import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseEntity {
  @Field(() => String, { name: 'id' })
  _id?: string;

  @Field(() => GraphQLISODateTime)
  createdAt?: string;

  @Field(() => GraphQLISODateTime)
  updatedAt?: string;
}
