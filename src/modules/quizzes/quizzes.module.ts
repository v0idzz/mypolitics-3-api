import { forwardRef, Logger, Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesResolver } from './quizzes.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from './entities/quiz.entity';
import { QuizMeta, QuizMetaSchema } from './entities/quiz-meta.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import quizzesConfig from '../../config/quizzes.config';
import { QuizVersion, QuizVersionSchema } from '../quiz-versions/entities/quiz-version.entity';
import { QuizVersionsService } from '../quiz-versions/quiz-versions.service';
import { QuizVersionsModule } from '../quiz-versions/quiz-versions.module';
import { QuizVerifyRequest, QuizVerifyRequestSchema } from './entities/quiz-verify-request.entity';

@Module({
  imports: [
    forwardRef(() => QuizVersionsModule),
    ConfigModule.forFeature(quizzesConfig),
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
      { name: QuizMeta.name, schema: QuizMetaSchema },
      { name: QuizVersion.name, schema: QuizVersionSchema },
      { name: QuizVerifyRequest.name, schema: QuizVerifyRequestSchema },
    ], 'main'),
  ],
  providers: [ConfigService, QuizzesResolver, QuizVersionsService, QuizzesService, Logger],
  exports: [ConfigService]
})
export class QuizzesModule {}
