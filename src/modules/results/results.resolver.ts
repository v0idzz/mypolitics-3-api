import { Args, Query, Resolver } from '@nestjs/graphql';
import { Results } from './entities/results.entity';
import { SurveysService } from '../surveys/surveys.service';
import { BadRequestException } from '@nestjs/common';
import { ErrorsMessages } from '../../constants';
import { ErrorCode } from '../../types';
import { getAnswersResults } from './utils/get-answers-results';
import { QuizzesService } from '../quizzes/quizzes.service';
import { ResultsClassicService } from '../results-classic/results-classic.service';;

@Resolver(() => Results)
export class ResultsResolver {
  constructor(
    private readonly surveysService: SurveysService,
    private readonly quizzesService: QuizzesService,
    private readonly resultsClassicService: ResultsClassicService,
  ) {}

  @Query(() => Results)
  async results(
    @Args({ name: 'surveyId', type: () => String }) _id: string,
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

    const answersResults = getAnswersResults(survey);
    const { _id: surveyId, createdAt, updatedAt } = survey;
    const quiz = await this.quizzesService.findOne({ versions: { $in: [survey.quizVersion] } });

    return {
      ...answersResults,
      _id: surveyId,
      createdAt,
      updatedAt,
      quiz,
    };
  }
}
