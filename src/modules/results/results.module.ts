import { Logger, Module } from '@nestjs/common';
import { ResultsResolver } from './results.resolver';
import { SurveysModule } from '../surveys/surveys.module';
import { SurveysService } from '../surveys/surveys.service';
import { Survey, SurveySchema } from '../surveys/entities/survey.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [SurveysModule, MongooseModule.forFeature([
    { name: Survey.name, schema: SurveySchema },
  ])],
  providers: [ResultsResolver, SurveysService, Logger]
})
export class ResultsModule {}
