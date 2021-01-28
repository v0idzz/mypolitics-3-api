import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class IdeologyIconInput {
  @Field()
  type: 'font-awesome' | 'url';

  @Field()
  value: string;
}
