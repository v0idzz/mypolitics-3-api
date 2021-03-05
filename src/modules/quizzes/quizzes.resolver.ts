import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { QuizzesService } from './quizzes.service';
import { Quiz, QuizDocument } from './entities/quiz.entity';
import { CreateQuizInput } from './dto/create-quiz.input';
import { UpdateQuizInput } from './dto/update-quiz.input';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { QuizMeta } from './entities/quiz-meta.entity';
import { QuizType } from './enums/quiz-type.enum';
import { QuizVersion } from '../quiz-versions/entities/quiz-version.entity';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { QuizLicense } from './enums/quiz-license.enum';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { QuizVersionsService } from '../quiz-versions/quiz-versions.service';
import { QuizVerificationState } from './enums/quiz-verification-state.enum';
import { UserRole } from '../users/enums/user-role';
import { VerifyQuizInput } from './dto/verify-quiz.input';

@Resolver(() => Quiz)
export class QuizzesResolver {
  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly quizVersionsService: QuizVersionsService,
  ) {}

  @Mutation(() => Quiz)
  @UseGuards(GqlAuthGuard)
  async createQuiz(
    @Args('createQuizInput') createQuizInput: CreateQuizInput,
    @CurrentUser() user: User
  ) {
    const slug = await this.quizzesService.getSlug();
    const currentVersion = await this.quizVersionsService.createOne({
      axes: [],
      questions: [],
      compassModes: [],
      traits: [],
      ideologies: [],
      parties: []
    });

    return this.quizzesService.createOne({
      ...createQuizInput,
      slug,
      currentVersion,
      versions: [currentVersion],
      meta: {
        license: QuizLicense.MIT,
        authors: [user],
        statistics: {
          surveysNumber: 0,
        },
        features: {
          authorizedParties: [],
          politiciansResults: false,
        },
      }
    });
  }

  @Query(() => Quiz, { name: 'quiz' })
  async findOne(
    @Args('slug', { type: () => String }) slug: string,
  ): Promise<Quiz> {
    const idRegex = /^[a-f\d]{24}$/;
    const slugIsId = !!slug.match(idRegex);
    const conditions = slugIsId ? { _id: slug } : { slug };

    return this.quizzesService.findOne(conditions, {}, {
      populate: {
        path: 'versions currentVersion lastUpdatedVersion',
        populate: {
          path: 'ideologies axes traits questions parties',
        }
      }
    });
  }

  @Query(() => [Quiz], { name: 'featuredQuizzes' })
  async findFeatured(): Promise<Quiz[]> {
    return this.quizzesService.getFeaturedQuizzes();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Quiz], { name: 'verifyQueueQuizzes' })
  async findVerifyQueue(
    @CurrentUser() user: User
  ): Promise<Quiz[]> {
    const isModerator = [UserRole.ADMIN, UserRole.MODERATOR].includes(user.role);
    if (!isModerator) {
      throw new UnauthorizedException();
    }

    return this.quizzesService.findMany({
      'verifyRequest.state': QuizVerificationState.IDLE,
    });
  }

  @Mutation(() => Quiz)
  @UseGuards(GqlAuthGuard)
  async updateQuiz(
    @Args({ name: 'id', type: () => String }) _id: string,
    @Args('updateQuizInput') updateQuizInput: UpdateQuizInput,
    @CurrentUser() user: User
  ): Promise<Quiz> {
    const quiz = await this.quizzesService.findOne({ _id });
    const hasPermission = user.isAdmin() || quiz.isAuthor(user);

    if (!hasPermission) {
      throw new UnauthorizedException();
    }

    return this.quizzesService.updateOne({ _id }, updateQuizInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async requestQuizVerify(
    @Args({ name: 'id', type: () => String }) _id: string,
    @CurrentUser() user: User
  ): Promise<boolean> {
    const quiz = await this.quizzesService.findOne({ _id });

    if (!quiz.isAuthor(user)) {
      throw new UnauthorizedException();
    }

    await quiz.updateOne({
      verifyRequest: {
        version: quiz.lastUpdatedVersion,
        state: QuizVerificationState.IDLE
      }
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async verifyQuiz(
    @Args({ name: 'id', type: () => String }) _id: string,
    @Args('verifyQuizInput') verifyQuizInput: VerifyQuizInput,
    @CurrentUser() user: User
  ): Promise<boolean> {
    const isModerator = [UserRole.ADMIN, UserRole.MODERATOR].includes(user.role);
    if (!isModerator) {
      throw new UnauthorizedException();
    }

    const quiz = await this.quizzesService.findOne({ _id });

    await quiz.updateOne({
      verifyRequest: {
        version: quiz.verifyRequest.version,
        moderator: user,
        ...verifyQuizInput
      }
    });

    return true;
  }

  @ResolveField()
  async meta(@Parent() quiz: QuizDocument): Promise<QuizMeta> {
    await quiz.populate('versions currentVersion').execPopulate();
    const { currentVersion } = quiz;
    const { compassModes, axes, questions, traits, parties, ideologies } = currentVersion;

    const features = {
      ...quiz.meta.features,
      axesNumber: axes.length,
      questionsNumber: questions.length,
      compass: compassModes.length > 0,
      traits: traits.length > 0,
      parties: parties.length > 0,
      ideologies: ideologies.length > 0,
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

  @ResolveField()
  async lastUpdatedVersion(@Parent() quiz: QuizDocument): Promise<QuizVersion> {
    const versions = quiz.populate('versions').versions.sort((a, b) => (
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ));

    return versions[0];
  }
}
