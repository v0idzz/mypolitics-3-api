import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { RespondentsService } from './respondents.service';
import { Respondent } from './entities/respondent.entity';
import { CreateRespondentInput } from './dto/create-respondent.input';
import { UpdateRespondentInput } from './dto/update-respondent.input';
import { UseGuards } from '@nestjs/common';
import { RespondentGuard } from '../../shared/guards/respondent.guard';
import { CurrentRespondent } from '../../shared/decorators/current-respondent.decorator';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import Cookies from 'cookies';
import { Cookies as ConstCookies } from '../../constants';

@Resolver(() => Respondent)
export class RespondentsResolver {
  constructor(private readonly respondentsService: RespondentsService) {}

  @Mutation(() => Respondent)
  async createRespondent(@Args('createRespondentInput') { lang }: CreateRespondentInput) {
    const code = await this.respondentsService.generateCode(lang);
    return this.respondentsService.createOne({ code, surveys: [] });
  }

  @Query(() => Respondent, { name: 'respondent' })
  findOne(
    @Args('code', { type: () => [String] }) code: string[],
  ): Promise<Respondent> {
    return this.respondentsService.findOne({ code });
  }

  @Query(() => Respondent, { name: 'meRespondent' })
  @UseGuards(RespondentGuard)
  me(@CurrentRespondent() respondent): Promise<Respondent> {
    return this.respondentsService.findOne(
      respondent,
      {},
      { populate: 'surveys' },
    );
  }

  @Mutation(() => Respondent)
  @UseGuards(RespondentGuard)
  async updateRespondent(
    @Args('updateRespondentInput') { details }: UpdateRespondentInput,
    @CurrentRespondent() respondent
  ): Promise<Respondent> {
    return this.respondentsService.updateOne(respondent, { details });
  }

  @Mutation(() => Respondent)
  async changeCode(
    @Args({ name: 'code', type: () => [String] }) code: string[],
    @Context() { req, res }: ExpressContext
  ): Promise<Respondent> {
    const cookies = new Cookies(req, res);
    const respondent = await this.respondentsService.findOne({ code });
    const { _id } = respondent;
    const respondentData = Buffer.from(JSON.stringify({ _id })).toString('base64');
    cookies.set(ConstCookies.RESPONDENT, respondentData);
    return respondent;
  }

  @Mutation(() => Respondent)
  @UseGuards(RespondentGuard)
  removeMe(@CurrentRespondent() respondent: Respondent) {
    return this.respondentsService.deleteOne(respondent);
  }
}
