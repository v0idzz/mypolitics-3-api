import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RespondentsService } from './respondents.service';
import { Respondent } from './entities/respondent.entity';
import { CreateRespondentInput } from './dto/create-respondent.input';
import { UpdateRespondentInput } from './dto/update-respondent.input';
import { codesSets, getRandomCode } from './utils/codes-sets';
import { UseGuards } from '@nestjs/common';
import { RespondentGuard } from '../../shared/guards/respondent.guard';
import { CurrentRespondent } from '../../shared/decorators/current-respondent.decorator';

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
  @UseGuards(RespondentGuard)
  removeMe(@CurrentRespondent() respondent: Respondent) {
    return this.respondentsService.deleteOne(respondent);
  }
}
