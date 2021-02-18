import { Logger, Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsResolver } from './questions.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './entities/question.entity';
import { QuestionEffects, QuestionEffectsSchema } from './entities/question-effects.entity';
import { QuestionPositiveEffect, QuestionPositiveEffectSchema } from './entities/question-positive-effect.entity';
import { QuizVersionsModule } from '../quiz-versions/quiz-versions.module';
import { QuizVersionsService } from '../quiz-versions/quiz-versions.service';
import { QuizVersion, QuizVersionSchema } from '../quiz-versions/entities/quiz-version.entity';
import { Party, PartySchema } from '../parties/entities/party.entity';
import { PartiesService } from '../parties/parties.service';
import { PartiesModule } from '../parties/parties.module';

@Module({
  imports: [
    PartiesModule,
    QuizVersionsModule,
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: QuestionEffects.name, schema: QuestionEffectsSchema },
      { name: QuestionPositiveEffect.name, schema: QuestionPositiveEffectSchema },
      { name: QuizVersion.name, schema: QuizVersionSchema },
      { name: Party.name, schema: PartySchema },
    ], 'main'),
  ],
  providers: [QuestionsResolver, QuizVersionsService, QuestionsService, PartiesService, Logger]
})
export class QuestionsModule {}
