import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IdeologyIcon {
  @Field()
  type: 'font-awesome' | 'url';

  @Field()
  value: string;
}
