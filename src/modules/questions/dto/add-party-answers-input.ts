import { Field, InputType } from '@nestjs/graphql';
import { TextTranslationInput } from '../../../shared/entities/text-translation.entity';
import { SurveyAnswerType } from '../../surveys/enums/survey-answer-type.enum';

@InputType()
export class AddPartyAnswersInput {
  @Field(() => TextTranslationInput)
  questionText: TextTranslationInput;

  @Field(() => SurveyAnswerType)
  answer: SurveyAnswerType;
}
