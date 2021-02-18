import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassicResults, ClassicResultsDocument } from './entities/results-classic.entity';
import { transformClassicResults } from './config/results-classic.config';

@Injectable()
export class ResultsClassicService extends BaseService<ClassicResultsDocument> {
  constructor(
    readonly logger: Logger,
    @InjectModel(ClassicResults.name) readonly classicResultsModel: Model<ClassicResultsDocument>
  ) {
    super(logger, classicResultsModel);
  }

  transformToModernResults(classicResults: ClassicResults): any {
    return transformClassicResults(classicResults);
  }
}
