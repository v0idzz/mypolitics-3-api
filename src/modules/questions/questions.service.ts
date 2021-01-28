import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionDocument } from './entities/question.entity';
import { Model } from 'mongoose';

@Injectable()
export class QuestionsService extends BaseService<QuestionDocument> {
  constructor(
    readonly logger: Logger,
    @InjectModel(Question.name) readonly questionsModel: Model<QuestionDocument>
  ) {
    super(logger, questionsModel);
  }
}
