import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { SurveysService } from './surveys.service';
import { Survey } from './entities/survey.entity';
import { CreateSurveyInput } from './dto/create-survey.input';
import { UpdateSurveyInput } from './dto/update-survey.input';
import { getRespondentFromHeader } from '../../shared/utils/get-respondent-from-header';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ErrorsMessages } from '../../constants';
import { ErrorCode } from '../../types';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { RespondentsService } from '../respondents/respondents.service';

@Resolver(() => Survey)
export class SurveysResolver {
  constructor(
    private readonly surveysService: SurveysService,
    private readonly respondentsService: RespondentsService,
  ) {}

  @Mutation(() => Survey)
  async createSurvey(
    @Args('createSurveyInput') createSurveyInput: CreateSurveyInput,
    @Context() context: ExpressContext,
  ) {
    const respondent = getRespondentFromHeader(context);
    if (!respondent) {
      throw new UnauthorizedException(
        ErrorsMessages[ErrorCode.RESPONDENT_HEADER_NOT_PROVIDED],
      );
    }

    const survey = await this.surveysService.createOne({
      finished: false,
      answers: [],
    });

    await this.respondentsService.updateOne(respondent, {
      $push: { surveys: survey },
    });

    return survey;
  }

  @Query(() => Survey, { name: 'survey' })
  findOne(
    @Args('id', { type: () => String }) _id: string,
    @Context() context: ExpressContext,
  ) {
    const respondent = getRespondentFromHeader(context);
    if (!respondent) {
      throw new UnauthorizedException(
        ErrorsMessages[ErrorCode.RESPONDENT_HEADER_NOT_PROVIDED],
      );
    }

    return this.surveysService.findOne({
      _id,
    });
  }

  @Mutation(() => Survey)
  async updateSurvey(
    @Args('updateSurveyInput') { id, ...updateSurveyInput }: UpdateSurveyInput,
    @Context() context: ExpressContext,
  ) {
    const respondent = getRespondentFromHeader(context);
    if (!respondent) {
      throw new UnauthorizedException(
        ErrorsMessages[ErrorCode.RESPONDENT_HEADER_NOT_PROVIDED],
      );
    }

    const hasPermission = await this.respondentsService.findOneOrNull({
      _id: { $eq: respondent._id },
      surveys: { $all: [id] },
    });
    if (!hasPermission) {
      throw new UnauthorizedException(
        ErrorsMessages[ErrorCode.NOT_AUTHORIZED],
      );
    }

    const survey = await this.surveysService.updateOne({
      finished: false,
      _id: id
    }, updateSurveyInput);
    if (!survey) {
      throw new BadRequestException(ErrorsMessages[ErrorCode.SURVEY_FINISHED]);
    }

    return survey;
  }
}
