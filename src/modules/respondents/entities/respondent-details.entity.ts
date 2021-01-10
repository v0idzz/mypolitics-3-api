import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RespondentDetails {
  @Field()
  ideology: string;

  @Field(() => [Number])
  compassPoint: number[];
}
