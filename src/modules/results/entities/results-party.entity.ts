import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Party } from '../../parties/entities/party.entity';

@ObjectType()
export class ResultsParty extends Party {
  @Field(() => Int)
  points: number;
}
