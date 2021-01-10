import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz, QuizDocument } from './entities/quiz.entity';
import { Model } from 'mongoose';

@Injectable()
export class QuizzesService extends BaseService<QuizDocument> {
  constructor(
    readonly logger: Logger,
    @InjectModel(Quiz.name) readonly quizzesModel: Model<QuizDocument>
  ) {
    super(logger, quizzesModel);
  }
}
