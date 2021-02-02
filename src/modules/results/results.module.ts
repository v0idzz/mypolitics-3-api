import { Logger, Module } from '@nestjs/common';
import { ResultsResolver } from './results.resolver';
import { SurveysModule } from '../surveys/surveys.module';
import { SurveysService } from '../surveys/surveys.service';
import { Survey, SurveySchema } from '../surveys/entities/survey.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from '../quizzes/entities/quiz.entity';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { QuizzesService } from '../quizzes/quizzes.service';

@Module({
  imports: [
    QuizzesModule,
    SurveysModule,
    MongooseModule.forFeature([
      { name: Survey.name, schema: SurveySchema },
      { name: Quiz.name, schema: QuizSchema },
    ])
  ],
  providers: [QuizzesService, ResultsResolver, SurveysService, Logger]
})
export class ResultsModule {}
