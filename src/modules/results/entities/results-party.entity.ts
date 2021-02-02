import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Party } from '../../parties/entities/party.entity';

@ObjectType()
export class ResultsParty extends Party {
  @Field(() => Int)
  agreementPoints: number;

  @Field(() => Int)
  disagreementPoints: number;

  @Field(() => Int)
  percentAgreement: number;
}
