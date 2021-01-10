import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey, SurveyDocument } from './entities/survey.entity';

@Injectable()
export class SurveysService extends BaseService<SurveyDocument> {
  constructor(
    readonly logger: Logger,
    @InjectModel(Survey.name) readonly surveysModel: Model<SurveyDocument>
  ) {
    super(logger, surveysModel);
  }
}
