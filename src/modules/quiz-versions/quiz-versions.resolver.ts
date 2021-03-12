import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { QuizVersionsService } from './quiz-versions.service';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { QuizVersion } from './entities/quiz-version.entity';
import { UpdateQuizVersionInput } from './dto/update-quiz-version.input';
import { CreateQuizVersionInput } from './dto/create-quiz-version.input';
import { QuizzesService } from '../quizzes/quizzes.service';
import { observableDiff, applyChange } from 'deep-diff';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { quizVersionToInput } from './utils/quiz-version-to-input';
import { ErrorsMessages } from '../../constants';
import { ErrorCode } from '../../types';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => QuizVersion)
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
      traits: [],
      parties: [],
      ideologies: [],
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
      populate: ['axes.left', 'axes.right', 'traits']
    });
  }

  @Mutation(() => QuizVersion)
  @UseGuards(GqlAuthGuard)
  async saveQuizVersion(
    @Args({ name: 'id', type: () => String }) _id: string,
    @Args({ name: 'publish', type: () => Boolean }) publish: boolean,
    @Args('saveQuizVersionInput') saveQuizVersionInput: UpdateQuizVersionInput,
    @CurrentUser() user: User,
  ): Promise<QuizVersion> {
    const version = await this.quizVersionsService.findOne({ _id });
    const quiz = await this.quizzesService.findOne({ versions: { $in: [version] } });
    if (!quiz.isAuthor(user)) {
      throw new UnauthorizedException(ErrorsMessages[ErrorCode.NOT_AUTHORIZED]);
    }

    const versionInput = quizVersionToInput(version);
    observableDiff(versionInput, saveQuizVersionInput, function (d) {
      applyChange(versionInput, saveQuizVersionInput, d);
    });

    const currentVersion = await this.quizVersionsService.createOne({
      ...(versionInput as any),
      publishedOn: (publish ? new Date().toISOString() : null)
    });

    await this.quizzesService.updateOne({
      _id: quiz._id,
    }, {
      currentVersion,
      $push: { versions: currentVersion },
    });

    return currentVersion;
  }

  @Mutation(() => QuizVersion)
  @UseGuards(GqlAuthGuard)
  async updateQuizVersion(
    @Args({ name: 'id', type: () => String }) _id: string,
    @Args('updateQuizVersionInput') updateQuizVersionInput: UpdateQuizVersionInput,
    @CurrentUser() user: User,
  ): Promise<QuizVersion> {
    const quizVersion = await this.quizVersionsService.findOne({ _id });
    const quiz = await this.quizzesService.findOne({ versions: { $in: [quizVersion] } });
    if (!quiz.isAuthor(user)) {
      throw new UnauthorizedException(ErrorsMessages[ErrorCode.NOT_AUTHORIZED]);
    }

    if (!!quizVersion.publishedOn) {
      throw new UnauthorizedException(ErrorsMessages[ErrorCode.QUIZ_VERSION_PUBLISHED]);
    }

    return this.quizVersionsService.updateOne({ _id }, updateQuizVersionInput);
  }

  @ResolveField(() => Quiz)
  async quiz(@Parent() quizVersion: QuizVersion): Promise<Quiz> {
    return this.quizzesService.findOne({ versions: { $in: [quizVersion] } });
  }
}
