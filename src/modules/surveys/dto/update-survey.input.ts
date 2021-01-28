import { InputType, Field } from '@nestjs/graphql';
import { SurveyAnswerInput } from './survey-answer.input';

@InputType()
export class UpdateSurveyInput {
  @Field(() => [SurveyAnswerInput], { nullable: 'items' })
  answers?: SurveyAnswerInput[];

  @Field(() => Boolean, { nullable: true })
  finished?: boolean;
}
