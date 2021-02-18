import { Logger, Module } from '@nestjs/common';
import { ResultsResolver } from './results.resolver';
import { SurveysModule } from '../surveys/surveys.module';
import { SurveysService } from '../surveys/surveys.service';
import { Survey, SurveySchema } from '../surveys/entities/survey.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from '../quizzes/entities/quiz.entity';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { QuizzesService } from '../quizzes/quizzes.service';
import { ResultsClassicModule } from '../results-classic/results-classic.module';
import { ResultsClassicService } from '../results-classic/results-classic.service';
import { ClassicResults, ClassicResultsSchema } from '../results-classic/entities/results-classic.entity';

@Module({
  imports: [
    QuizzesModule,
    SurveysModule,
    ResultsClassicModule,
    MongooseModule.forFeature([
      { name: Survey.name, schema: SurveySchema },
      { name: Quiz.name, schema: QuizSchema },
    ], 'main'),
    MongooseModule.forFeature([
      { name: ClassicResults.name, schema: ClassicResultsSchema },
    ], 'classic')
  ],
  providers: [QuizzesService, ResultsResolver, SurveysService, ResultsClassicService, Logger]
})
export class ResultsModule {}
