import { Logger, Module } from '@nestjs/common';
import { QuizVersionsService } from './quiz-versions.service';
import { QuizVersionsResolver } from './quiz-versions.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizVersion, QuizVersionSchema } from './entities/quiz-version.entity';
import { QuizAxis, QuizAxisSchema } from './entities/quiz-axis.entity';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { QuizzesService } from '../quizzes/quizzes.service';
import { Quiz, QuizSchema } from '../quizzes/entities/quiz.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizVersion.name, schema: QuizVersionSchema },
      { name: QuizAxis.name, schema: QuizAxisSchema },
      { name: Quiz.name, schema: QuizSchema },
    ], 'main'),
    QuizzesModule,
  ],
  providers: [QuizzesService, QuizVersionsResolver, QuizVersionsService, Logger]
})
export class QuizVersionsModule {}
