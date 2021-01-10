import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RespondentDetailsInput {
  @Field()
  ideology: string;

  @Field(() => [Number])
  compassPoint: number[];
}
