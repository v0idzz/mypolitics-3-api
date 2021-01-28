import { InputType, Field } from '@nestjs/graphql';
import { QuizVersion } from '../../quiz-versions/entities/quiz-version.entity';

@InputType()
export class CreateSurveyInput {
  @Field(() => String)
  quizVersion: QuizVersion;
}
