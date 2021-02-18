import { Logger, Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysResolver } from './surveys.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from './entities/survey.entity';
import { RespondentsModule } from '../respondents/respondents.module';
import { RespondentsService } from '../respondents/respondents.service';
import { Respondent, RespondentSchema } from '../respondents/entities/respondent.entity';
import { SurveyAnswer, SurveyAnswerSchema } from './entities/survey-answer.entity';
import { Quiz, QuizSchema } from '../quizzes/entities/quiz.entity';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { QuizzesService } from '../quizzes/quizzes.service';

@Module({
  imports: [
    RespondentsModule,
    QuizzesModule,
    MongooseModule.forFeature([
      { name: Survey.name, schema: SurveySchema },
      { name: Respondent.name, schema: RespondentSchema },
      { name: SurveyAnswer.name, schema: SurveyAnswerSchema },
      { name: Quiz.name, schema: QuizSchema }
    ], 'main'),
  ],
  providers: [QuizzesService, SurveysResolver, SurveysService, Logger, RespondentsService]
})
export class SurveysModule {}
