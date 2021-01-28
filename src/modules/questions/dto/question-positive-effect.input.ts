import { Field, InputType } from '@nestjs/graphql';
import { Party } from '../../parties/entities/party.entity';
import { Ideology } from '../../ideologies/entities/ideology.entity';

@InputType()
export class QuestionPositiveEffectInput {
  @Field(() => [String])
  ideologies: Ideology[];

  @Field(() => [String])
  parties: Party[];
}
