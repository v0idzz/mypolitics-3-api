import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Ideology } from '../../ideologies/entities/ideology.entity';

@ObjectType()
export class ResultsIdeology extends Ideology {
  @Field(() => Int)
  points: number;
}
