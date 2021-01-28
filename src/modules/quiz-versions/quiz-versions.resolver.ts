import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { QuizVersionsService } from './quiz-versions.service';
import { UseGuards } from '@nestjs/common';
import { RespondentGuard } from '../../shared/guards/respondent.guard';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { QuizVersion } from './entities/quiz-version.entity';
import { UpdateQuizVersionInput } from './dto/update-quiz-version.input';
import { CreateQuizVersionInput } from './dto/create-quiz-version.input';
import { QuizzesService } from '../quizzes/quizzes.service';

@Resolver(() => QuizVersion)
@UseGuards(RespondentGuard)
export class QuizVersionsResolver {
  constructor(
    private readonly quizVersionsService: QuizVersionsService,
    private readonly quizzesService: QuizzesService,
  ) {}

  @Mutation(() => QuizVersion)
  @UseGuards(AdminGuard)
  async createQuizVersion(
    @Args('quizId') quizId: string,
    @Args('createQuizVersionInput') createQuizVersionInput: CreateQuizVersionInput,
  ) {
    const version = await this.quizVersionsService.createOne({
      questions: [],
      compassModes: [],
      ...createQuizVersionInput
    });

    await this.quizzesService.updateOne({
      _id: quizId,
    }, {
      $push: { versions: version },
    });

    return version;
  }

  @Query(() => QuizVersion, { name: 'quizVersion' })
  async findOne(
    @Args('id', { type: () => String }) _id: string,
  ): Promise<QuizVersion> {
    return this.quizVersionsService.findOne({ _id }, {}, {
      populate: ['axes.left', 'axes.right']
    });
  }

  @Mutation(() => QuizVersion)
  @UseGuards(AdminGuard)
  async updateQuizVersion(
    @Args({ name: 'id', type: () => String }) _id: string,
    @Args('updateQuizVersionInput') updateQuizVersionInput: UpdateQuizVersionInput,
  ): Promise<QuizVersion> {
    return this.quizVersionsService.updateOne({ _id }, updateQuizVersionInput);
  }
}
