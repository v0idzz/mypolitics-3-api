import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TextTranslation } from '../../../shared/entities/text-translation.entity';
import { ResultsIdeology } from './results-ideology.entity';

@ObjectType()
export class ResultsAxis {
  @Field(() => TextTranslation,  { nullable: true })
  name?: TextTranslation;

  @Field(() => ResultsIdeology)
  left: ResultsIdeology;

  @Field(() => ResultsIdeology)
  right: ResultsIdeology;

  @Field(() => Int)
  maxPoints: number;
}
