import { Args, Query, Resolver } from '@nestjs/graphql';
import { Results } from './entities/results.entity';
import { SurveysService } from '../surveys/surveys.service';
import { BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ErrorsMessages } from '../../constants';
import { ErrorCode } from '../../types';
import { getAnswersResults } from './utils/get-answers-results';
import { QuizzesService } from '../quizzes/quizzes.service';
import { ResultsClassicService } from '../results-classic/results-classic.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { QuizType } from '../quizzes/enums/quiz-type.enum';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';

@Resolver(() => Results)
export class ResultsResolver {
  constructor(
    private readonly surveysService: SurveysService,
    private readonly quizzesService: QuizzesService,
    private readonly resultsClassicService: ResultsClassicService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => Results)
  async results(
    @Args({ name: 'surveyId', type: () => String }) _id: string,
    @CurrentUser() user: User
  ): Promise<Results> {
    const survey = await this.surveysService.findOne({ _id }, {}, {
      populate: {
        path: 'quizVersion answers',
        populate: {
          path: 'question axes traits',
          populate: {
            path: 'horizontal vertical third left right effects',
            populate: {
              path: 'agree disagree ideologies',
              populate: {
                path: 'parties ideologies ideology',
              }
            }
          }
        }
      }
    });

    if (!survey) {
      const classicResults = await this.resultsClassicService.findOne({ _id });
      const quiz = await this.quizzesService.findOne({ slug: 'classic' });
      return {
        ...this.resultsClassicService.transformToModernResults(classicResults['_doc']),
        quiz,
      };
    }

    if (!survey.finished) {
      throw new BadRequestException(ErrorsMessages[ErrorCode.SURVEY_NOT_FINISHED]);
    }

    const quiz = await this.quizzesService.findOne({ versions: { $in: [survey.quizVersion] } });
    const canSee = quiz.type === QuizType.OFFICIAL || !!survey.quizVersion.verifiedOn || (user && quiz.isAuthor(user));
    if (!canSee) {
      throw new UnauthorizedException(ErrorsMessages[ErrorCode.NOT_AUTHORIZED]);
    }

    const answersResults = getAnswersResults(survey);
    const { _id: surveyId, createdAt, updatedAt } = survey;

    return {
      ...answersResults,
      _id: surveyId,
      createdAt,
      updatedAt,
      quiz,
    };
  }
}
