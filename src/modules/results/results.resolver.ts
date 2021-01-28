import { Resolver, Args, Query } from '@nestjs/graphql';
import { Results } from './entities/results.entity';
import { SurveysService } from '../surveys/surveys.service';
import { BadRequestException } from '@nestjs/common';
import { ErrorsMessages } from '../../constants';
import { ErrorCode } from '../../types';
import { getAnswersResults } from './utils/get-answers-results';

@Resolver(() => Results)
export class ResultsResolver {
  constructor(
    private readonly surveysService: SurveysService,
  ) {}

  @Query(() => Results)
  async results(
    @Args({ name: 'surveyId', type: () => String }) _id: string,
  ): Promise<Results> {
    const survey = await this.surveysService.findOne({ _id }, {}, {
      populate: {
        path: 'quizVersion answers',
        populate: {
          path: 'question axes',
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

    const { parties, axes } = getAnswersResults(survey);

    if (!survey.finished) {
      throw new BadRequestException(ErrorsMessages[ErrorCode.SURVEY_NOT_FINISHED]);
    }

    return {
      parties,
      axes,
      compasses: [],
    };
  }
}
