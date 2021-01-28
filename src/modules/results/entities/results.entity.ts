import { Field, ObjectType } from '@nestjs/graphql';
import { ResultsParty } from './results-party.entity';
import { ResultsAxis } from './results-axis.entity';
import { ResultsCompass } from './results-compass.entity';

@ObjectType()
export class Results {
  @Field(() => [ResultsAxis])
  axes: ResultsAxis[];

  @Field(() => [ResultsParty])
  parties: ResultsParty[];

  @Field(() => [ResultsCompass])
  compasses: ResultsCompass[];
}
