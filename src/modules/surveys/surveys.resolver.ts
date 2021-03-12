import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SurveysService } from './surveys.service';
import { Survey } from './entities/survey.entity';
import { CreateSurveyInput } from './dto/create-survey.input';
import { UpdateSurveyInput } from './dto/update-survey.input';
import { BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ErrorsMessages } from '../../constants';
import { ErrorCode } from '../../types';
import { RespondentsService } from '../respondents/respondents.service';
import { RespondentGuard } from '../../shared/guards/respondent.guard';
import { CurrentRespondent } from '../../shared/decorators/current-respondent.decorator';
import { Respondent } from '../respondents/entities/respondent.entity';
import { QuizzesService } from '../quizzes/quizzes.service';

@Resolver(() => Survey)
@UseGuards(RespondentGuard)
export class SurveysResolver {
  constructor(
    private readonly surveysService: SurveysService,
    private readonly respondentsService: RespondentsService,
    private readonly quizzesService: QuizzesService,
  ) {}

  @Mutation(() => Survey)
  async createSurvey(
    @Args('createSurveyInput') createSurveyInput: CreateSurveyInput,
    @CurrentRespondent() respondent: Respondent
  ) {
    const survey = await this.surveysService.createOne({
      ...createSurveyInput,
      finished: false,
      answers: [],
    });

    await Promise.all([
      await this.respondentsService.updateOne(respondent, {
        $push: { surveys: survey },
      }),
      await this.quizzesService.updateOne(
        { versions: { $in: [createSurveyInput.quizVersion] }},
        { $inc: { 'meta.statistics.surveysNumber': 1 } }
      ),
    ]);

    return survey;
  }

  @Query(() => Survey, { name: 'survey' })
  findOne(@Args('id') _id: string) {
    return this.surveysService.findOne({ _id }, {}, {
      populate: {
        path: 'quizVersion answers',
        populate: {
          path: 'questions question quiz',
          populate: {
            path: 'effects',
            populate: {
              path: 'agree disagree',
              populate: {
                path: 'parties ideologies',
              }
            }
          }
        }
      }
    });
  }

  @Mutation(() => Survey)
  async updateSurvey(
    @Args({ name: 'id', type: () => String }) _id: string,
    @Args('updateSurveyInput') updateSurveyInput: UpdateSurveyInput,
    @CurrentRespondent() respondent: Respondent
  ) {
    const hasPermission = await this.respondentsService.findOneOrNull({
      _id: { $eq: respondent._id },
      surveys: { $all: [_id] },
    });

    if (!hasPermission) {
      throw new UnauthorizedException(
        ErrorsMessages[ErrorCode.NOT_AUTHORIZED],
      );
    }

    const survey = await this.surveysService.updateOne({
      finished: false,
      _id,
    },
    updateSurveyInput,
    {
      populate: {
        path: 'quizVersion',
        populate: {
          path: 'questions'
        }
      }
    });

    if (!survey) {
      throw new BadRequestException(ErrorsMessages[ErrorCode.SURVEY_FINISHED]);
    }

    return survey;
  }

  @Mutation(() => Boolean)
  async deleteSurvey(
    @Args({ name: 'id', type: () => String }) _id: string,
    @CurrentRespondent() { _id: respondentId }: Respondent
  ) {
    const respondent = await this.respondentsService.findOneOrNull({
      _id: { $eq: respondentId },
      surveys: { $all: [_id] },
    });

    const survey = await this.surveysService.findOne({ _id });

    if (!respondent) {
      throw new UnauthorizedException(
        ErrorsMessages[ErrorCode.NOT_AUTHORIZED],
      );
    }

    await respondent.updateOne({
      $pull: {
        surveys: survey._id,
      },
    });

    return true;
  }
}
