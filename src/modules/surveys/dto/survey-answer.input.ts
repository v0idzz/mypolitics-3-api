import { Field, InputType } from '@nestjs/graphql';
import { Question } from '../../questions/entities/question.entity';
import { SurveyAnswerType } from '../enums/survey-answer-type.enum';

@InputType()
export class SurveyAnswerInput {
  @Field(() => String)
  question: Question;

  @Field(() => SurveyAnswerType)
  type: SurveyAnswerType;

  @Field(() => Number)
  weight: number;
}
