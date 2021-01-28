import { Logger, Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysResolver } from './surveys.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from './entities/survey.entity';
import { RespondentsModule } from '../respondents/respondents.module';
import { RespondentsService } from '../respondents/respondents.service';
import { Respondent, RespondentSchema } from '../respondents/entities/respondent.entity';
import { SurveyAnswer, SurveyAnswerSchema } from './entities/survey-answer.entity';

@Module({
  imports: [
    RespondentsModule,
    MongooseModule.forFeature([
      { name: Survey.name, schema: SurveySchema },
      { name: Respondent.name, schema: RespondentSchema },
      { name: SurveyAnswer.name, schema: SurveyAnswerSchema }
    ]),
  ],
  providers: [SurveysResolver, SurveysService, Logger, RespondentsService]
})
export class SurveysModule {}
