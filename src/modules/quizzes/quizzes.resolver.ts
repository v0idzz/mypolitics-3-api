import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { QuizzesService } from './quizzes.service';
import { Quiz, QuizDocument } from './entities/quiz.entity';
import { CreateQuizInput } from './dto/create-quiz.input';
import { UpdateQuizInput } from './dto/update-quiz.input';
import { BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
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
import { QuizVoteType } from './enums/quiz-vote-type.enum';
import { ErrorsMessages } from '../../constants';
import { ErrorCode } from '../../types';
import { AuthService } from '../auth/auth.service';
import { getVotesWeight, getWeight } from './utils/get-quiz-weight';
import _ from 'lodash';
import { Language } from '../../shared/enums/language.enum';

@Resolver(() => Quiz)
export class QuizzesResolver {
  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly quizVersionsService: QuizVersionsService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => Quiz)
  @UseGuards(GqlAuthGuard)
  async createQuiz(
    @Args('createQuizInput') { languages, ...createQuizInput }: CreateQuizInput,
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
        languages,
        statistics: {
          surveysNumber: 0,
        },
        features: {
          authorizedParties: [],
          politiciansResults: false,
        },
        votes: {
          voters: [],
          value: 0
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
        path: 'versions currentVersion lastUpdatedVersion meta.authors',
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
  @Query(() => [Quiz], { name: 'currentUserQuizzes' })
  async findCreatedByCurrentUser(
    @CurrentUser() user: User,
  ): Promise<Quiz[]> {
    return this.quizzesService.findMany({ 'meta.authors': { $in: [user._id] } });
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

    const quizzes = await this.quizzesService.findMany({
      'verifyRequest.state': QuizVerificationState.IDLE,
    });

    return quizzes.sort((a, b) => (
      b.meta.votes.value - a.meta.votes.value
    ));
  }

  @Query(() => [Quiz], { name: 'socialQuizzes' })
  async findSocialQuizzes(
    @Args({ name: 'lang', type: () => Language }) lang: Language,
    @Args({ name: 'limit', type: () => Int, nullable: true }) limit?: number,
    @Args({ name: 'skip', type: () => Int, nullable: true }) skip?: number,
  ): Promise<Quiz[]> {
    // reverse compatibility
    const langFilter = (lang === Language.POLISH ? {
      $or: [
        {
          'meta.languages': {
            $in: [lang],
          },
        },
        {
          'meta.languages': {
            $exists: false,
          },
        }
      ]
    } : {
      'meta.languages': {
        $in: [lang]
      }
    });

    const quizzes = await this.quizzesService.findMany({
      'verifyRequest.state': QuizVerificationState.ACCEPTED,
      $where: 'this.verifyRequest.quizVersion == this.quizVersion',
      slug: {
        $nin: this.quizzesService.getFeaturedSlugs()
      },
      ...langFilter
    });

    if (quizzes.length === 0) {
      return [];
    }

    const maxSurveysQuiz = _.maxBy(quizzes, q => q.meta.statistics.surveysNumber);
    const maxSurveys = maxSurveysQuiz.meta.statistics.surveysNumber;
    const maxVotesQuiz = _.maxBy(quizzes, q => getVotesWeight(q['_doc'].meta.votes));
    const maxVotes = getVotesWeight(maxVotesQuiz['_doc'].meta.votes);
    const weight: Record<string, number> = {};

    const getWeightMemo = (q: Quiz) => {
      if (typeof weight[q._id] !== 'undefined') {
        return weight[q._id];
      }

      const quizWeight = getWeight(q, { maxSurveys, maxVotes });
      weight[q._id] = quizWeight;
      return quizWeight;
    };

    const sortedQuizzes = quizzes.sort((a, b) => getWeightMemo(b) - getWeightMemo(a));

    return sortedQuizzes.slice(skip, limit);
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
    @Args({ name: 'quizVersion', type: () => String }) _id: string,
    @Args({ name: 'recaptcha', type: () => String }) recaptcha: string,
    @CurrentUser() user: User
  ): Promise<boolean> {
    const captchaValid = await this.authService.validateReCaptcha(recaptcha);
    if (!captchaValid) {
      throw new BadRequestException();
    }

    const quizVersion = await this.quizVersionsService.findOne({ _id });
    const quiz = await this.quizzesService.findOne({ versions: { $in: [quizVersion] } });

    if (!quiz.isAuthor(user)) {
      throw new UnauthorizedException();
    }

    await quiz.updateOne({
      verifyRequest: {
        version: quizVersion,
        state: QuizVerificationState.IDLE
      }
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async verifyQuiz(
    @Args({ name: 'quizVersion', type: () => String }) _id: string,
    @Args('verifyQuizInput') verifyQuizInput: VerifyQuizInput,
    @CurrentUser() user: User
  ): Promise<boolean> {
    const isModerator = [UserRole.ADMIN, UserRole.MODERATOR].includes(user.role);
    if (!isModerator) {
      throw new UnauthorizedException();
    }

    const quizVersion = await this.quizVersionsService.findOne({ _id });
    const quiz = await this.quizzesService.findOne({ versions: { $in: [quizVersion] } });
    await quiz.updateOne({
      verifyRequest: {
        version: quiz.verifyRequest.version,
        moderator: user,
        ...verifyQuizInput
      }
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async voteQuiz(
    @Args({ name: 'id', type: () => String }) _id: string,
    @Args({ name: 'type', type: () => QuizVoteType }) type: QuizVoteType,
    @CurrentUser() user: User
  ): Promise<boolean> {
    const quiz = await this.quizzesService.findOne({ _id });
    const currentVoters = quiz.meta.votes.voters as unknown as string[];

    if (currentVoters.includes(user._id)) {
      throw new BadRequestException(ErrorsMessages[ErrorCode.USER_ALREADY_VOTED]);
    }

    await quiz.updateOne({
      $addToSet: {
        'meta.votes.voters': user._id,
      },
      $inc: {
        'meta.votes.value': type === QuizVoteType.FOR ? 1 : -1,
      }
    });

    return true;
  }

  @ResolveField()
  async meta(@Parent() quiz: QuizDocument): Promise<QuizMeta> {
    await quiz.populate('versions currentVersion').execPopulate();
    const { currentVersion, meta } = quiz;
    const { compassModes, axes, questions, traits, parties, ideologies } = currentVersion;
    const rawVotesValue = quiz['_doc'].meta.votes.value;

    const features = {
      ...meta.features,
      axesNumber: axes.length,
      questionsNumber: questions.length,
      compass: compassModes.length > 0,
      traits: traits.length > 0,
      parties: parties.length > 0,
      ideologies: ideologies.length > 0,
    };

    return {
      ...meta,
      features,
      votes: {
        ...meta.votes,
        // reverse compatibility with docs without votes
        value: typeof rawVotesValue === 'number' ? rawVotesValue : 0,
      }
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
