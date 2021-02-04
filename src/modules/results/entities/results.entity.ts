import { Field, ObjectType } from '@nestjs/graphql';
import { ResultsParty } from './results-party.entity';
import { ResultsAxis } from './results-axis.entity';
import { ResultsCompass } from './results-compass.entity';
import { BaseEntity } from '../../../shared/base/base.entity';
import { Quiz } from '../../quizzes/entities/quiz.entity';
import { Ideology } from '../../ideologies/entities/ideology.entity';

@ObjectType()
export class Results extends BaseEntity {
  @Field(() => [ResultsAxis])
  axes: ResultsAxis[];

  @Field(() => [ResultsParty])
  parties: ResultsParty[];

  @Field(() => [ResultsCompass])
  compasses: ResultsCompass[];

  @Field(() => Quiz)
  quiz: Quiz;

  @Field(() => [Ideology])
  traits: Ideology[];
}
