import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { QuizVersion, QuizVersionDocument } from './entities/quiz-version.entity';
import { Model } from 'mongoose';

@Injectable()
export class QuizVersionsService extends BaseService<QuizVersionDocument> {
  constructor(
    readonly logger: Logger,
    @InjectModel(QuizVersion.name) readonly quizVersionsModel: Model<QuizVersionDocument>
  ) {
    super(logger, quizVersionsModel);
  }
}
