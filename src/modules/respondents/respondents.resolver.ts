import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { RespondentsService } from './respondents.service';
import { Respondent } from './entities/respondent.entity';
import { CreateRespondentInput } from './dto/create-respondent.input';
import { UpdateRespondentInput } from './dto/update-respondent.input';
import { codesSets, getRandomCode } from './utils/codes-sets';
import { ErrorsMessages, Headers } from '../../constants';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { UnauthorizedException } from '@nestjs/common';
import { ErrorCode } from '../../types';
import { getRespondentFromHeader } from '../../shared/utils/get-respondent-from-header';

@Resolver(() => Respondent)
export class RespondentsResolver {
  constructor(private readonly respondentsService: RespondentsService) {}

  @Mutation(() => Respondent)
  async createRespondent(@Args('createRespondentInput') { lang }: CreateRespondentInput) {
    const set = codesSets[lang];
    let code: string[];
    let respondentFound: Respondent | null;

    do {
      code = getRandomCode(set);
      respondentFound = await this.respondentsService.findOneOrNull({ code });
    } while (respondentFound !== null);

    return this.respondentsService.createOne({ code, surveys: [] });
  }

  @Query(() => Respondent, { name: 'respondent' })
  findOne(
    @Args('code', { type: () => [String] }) code: string[],
  ): Promise<Respondent> {
    return this.respondentsService.findOne({ code });
  }

  @Query(() => Respondent, { name: 'meRespondent' })
  me(
    @Context() context: ExpressContext,
  ): Promise<Respondent> {
    const respondent = getRespondentFromHeader(context);
    if (!respondent) {
      throw new UnauthorizedException(
        ErrorsMessages[ErrorCode.RESPONDENT_HEADER_NOT_PROVIDED],
      );
    }

    return this.respondentsService.findOne(respondent, {}, { populate: 'surveys' });
  }

  @Mutation(() => Respondent)
  async updateRespondent(
    @Args('updateRespondentInput') { details }: UpdateRespondentInput,
    @Context() context: ExpressContext,
  ): Promise<Respondent> {
    const respondent = getRespondentFromHeader(context);
    if (!respondent) {
      throw new UnauthorizedException(
        ErrorsMessages[ErrorCode.RESPONDENT_HEADER_NOT_PROVIDED],
      );
    }

    return this.respondentsService.updateOne(respondent, { details });
  }

  @Mutation(() => Respondent)
  removeRespondent(@Args('id', { type: () => String }) _id: string) {
    return this.respondentsService.deleteOne({ _id });
  }
}
