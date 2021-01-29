import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { QuizVersionsService } from '../quiz-versions/quiz-versions.service';

@Resolver(() => Question)
@UseGuards(AdminGuard)
export class QuestionsResolver {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly quizVersionsService: QuizVersionsService,
  ) {}

  @Mutation(() => Question)
  async createQuestion(
    @Args({ name: 'quizVersion', type: () => String }) quizVersion: string,
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ): Promise<Question> {
    const question = await this.questionsService.createOne(createQuestionInput);

    await this.quizVersionsService.updateOne({
      _id: quizVersion,
    }, {
      $push: { questions: question },
    });

    return question;
  }

  @Mutation(() => [Question])
  async createManyQuestions(
    @Args({ name: 'quizVersion', type: () => String }) quizVersion: string,
    @Args({ name: 'createManyQuestionsInput', type: () => [CreateQuestionInput] })
      createManyQuestionsInput: CreateQuestionInput[],
  ) {
    const questions = await Promise.all(
      createManyQuestionsInput.map(q => this.questionsService.createOne(q))
    );

    await this.quizVersionsService.updateOne({
      _id: quizVersion,
    }, {
      $push: { questions },
    });

    return questions;
  }

  @Mutation(() => Question)
  async updateQuestion(
    @Args({ name: 'id', type: () => String }) _id: string,
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ): Promise<Question> {
    return this.questionsService.updateOne({ _id }, updateQuestionInput, {
      populate: {
        path: 'effects',
        populate: {
          path: 'agree disagree',
          populate: {
            path: 'ideologies parties',
          }
        }
      }
    });
  }
}
