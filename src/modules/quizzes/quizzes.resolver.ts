import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { QuizzesService } from './quizzes.service';
import { Quiz, QuizDocument } from './entities/quiz.entity';
import { CreateQuizInput } from './dto/create-quiz.input';
import { UpdateQuizInput } from './dto/update-quiz.input';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { QuizMeta } from './entities/quiz-meta.entity';
import { QuizType } from './enums/quiz-type.enum';

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
    const { currentVersion } = quiz;
    const { compassModes, axes, questions, traits } = currentVersion;

    const features = {
      ...quiz.meta.features,
      compass: compassModes.length > 0,
      axesNumber: axes.length,
      questionsNumber: questions.length,
      traits: traits.length > 0,
    };

    return {
      ...quiz.meta,
      features,
    };
  }

  @ResolveField()
  async type(@Parent() quiz: QuizDocument): Promise<QuizType> {
    const isFeatured = this.quizzesService.isFeatured(quiz);
    const notClassicType = isFeatured ? QuizType.OFFICIAL : QuizType.COMMUNITY;
    const isClassic = quiz.slug === 'classic';
    return isClassic ? QuizType.CLASSIC : notClassicType;
  }
}
