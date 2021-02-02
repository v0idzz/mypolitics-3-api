import { Field, Float, ObjectType } from '@nestjs/graphql';
import { QuizCompassMode } from '../../quiz-versions/entities/quiz-compass-mode.entity';

@ObjectType()
export class ResultsCompassPoint {
  @Field(() => Float)
  horizontal: number;

  @Field(() => Float)
  vertical: number;

  @Field(() => Float, { nullable: true })
  third?: number;
}

@ObjectType()
export class ResultsCompass extends QuizCompassMode {
  @Field(() => ResultsCompassPoint)
  point: ResultsCompassPoint;
}
