import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz, QuizDocument } from './entities/quiz.entity';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QuizzesService extends BaseService<QuizDocument> {
  constructor(
    private readonly configService: ConfigService,
    readonly logger: Logger,
    @InjectModel(Quiz.name) readonly quizzesModel: Model<QuizDocument>
  ) {
    super(logger, quizzesModel);
  }

  async getFeaturedQuizzes(): Promise<Quiz[]> {
    const slugs = this.configService.get<string[]>('quizzes.featuredSlugs');
    return this.findMany({ slug: { $in: slugs } });
  }

  isFeatured(quiz: Quiz): boolean {
    const slugs = this.configService.get<string[]>('quizzes.featuredSlugs');
    return slugs.includes(quiz.slug);
  }
}
