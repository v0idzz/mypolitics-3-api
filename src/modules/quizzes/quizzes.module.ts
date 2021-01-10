import { Logger, Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesResolver } from './quizzes.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from './entities/quiz.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
    ]),
  ],
  providers: [QuizzesResolver, QuizzesService, Logger]
})
export class QuizzesModule {}
