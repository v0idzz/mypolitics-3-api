import { Logger, Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesResolver } from './quizzes.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from './entities/quiz.entity';
import { QuizMeta, QuizMetaSchema } from './entities/quiz-meta.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import quizzesConfig from '../../config/quizzes.config';

@Module({
  imports: [
    ConfigModule.forFeature(quizzesConfig),
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
      { name: QuizMeta.name, schema: QuizMetaSchema },
    ], 'main'),
  ],
  providers: [ConfigService, QuizzesResolver, QuizzesService, Logger],
  exports: [ConfigService]
})
export class QuizzesModule {}
