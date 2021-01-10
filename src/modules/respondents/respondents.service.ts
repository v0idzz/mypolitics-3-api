import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { Respondent, RespondentDocument } from './entities/respondent.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class RespondentsService extends BaseService<RespondentDocument> {
  constructor(
    readonly logger: Logger,
    @InjectModel(Respondent.name) readonly respondentsModel: Model<RespondentDocument>
  ) {
    super(logger, respondentsModel);
  }
}
