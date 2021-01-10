import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateSurveyInput {
  @Field(() => String)
  id: string;

  @Field(() => [Int], { nullable: 'items' })
  answers?: number[];

  @Field(() => Boolean, { nullable: true })
  finished?: boolean;
}
