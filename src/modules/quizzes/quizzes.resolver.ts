import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { QuizzesService } from './quizzes.service';
import { Quiz, QuizDocument } from './entities/quiz.entity';
import { CreateQuizInput } from './dto/create-quiz.input';
import { UpdateQuizInput } from './dto/update-quiz.input';
import { UseGuards } from '@nestjs/common';
import { RespondentGuard } from '../../shared/guards/respondent.guard';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { QuizMeta } from './entities/quiz-meta.entity';

@Resolver(() => Quiz)
export class QuizzesResolver {
  constructor(
    private readonly quizzesService: QuizzesService,
  ) {}

  @Mutation(() => Quiz)
  @UseGuards(AdminGuard)
  async createQuiz(
    @Args('createQuizInput') createQuizInput: CreateQuizInput,
  ) {
    return this.quizzesService.createOne({
      ...createQuizInput,
      currentVersion: null,
      versions: [],
    });
  }

  @Query(() => Quiz, { name: 'quiz' })
  async findOne(
    @Args('slug', { type: () => String }) slug: string,
  ): Promise<Quiz> {
    return this.quizzesService.findOne({ slug }, {}, {
      populate: {
        path: 'versions currentVersion',
        populate: {
          path: 'axes questions',
          populate: {
            path: 'left right'
          }
        }
      }
    });
  }

  @Query(() => [Quiz], { name: 'featuredQuizzes' })
  async findFeatured(): Promise<Quiz[]> {
    return this.quizzesService.getFeaturedQuizzes();
  }

  @Mutation(() => Quiz)
  @UseGuards(AdminGuard)
  async updateQuiz(
    @Args({ name: 'id', type: () => String }) _id: string,
    @Args('updateQuizInput') updateQuizInput: UpdateQuizInput,
  ): Promise<Quiz> {
    return this.quizzesService.updateOne({ _id }, updateQuizInput);
  }

  @ResolveField()
  async meta(@Parent() quiz: QuizDocument): Promise<QuizMeta> {
    await quiz.populate('versions currentVersion').execPopulate();

    const features = {
      ...quiz.meta.features,
      compass: quiz.currentVersion.compassModes.length > 0,
      axesNumber: quiz.currentVersion.axes.length,
      questionsNumber: quiz.currentVersion.questions.length,
    };

    return {
      ...quiz.meta,
      features,
    };
  }
}
