import { Field, Int, ObjectType } from '@nestjs/graphql';
import { QuizCompassMode } from '../../quiz-versions/entities/quiz-compass-mode.entity';

@ObjectType()
export class ResultsCompass extends QuizCompassMode {
  @Field(() => [Int, Int, Int])
  point: [number, number, number];
}
