import { Resolver, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { PartiesService } from './parties.service';
import { Party } from './entities/party.entity';
import { CreatePartyInput } from './dto/create-party.input';
import { UpdatePartyInput } from './dto/update-party.input';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Ideology } from '../ideologies/entities/ideology.entity';

@Resolver(() => Party)
@UseGuards(GqlAuthGuard)
export class PartiesResolver {
  constructor(
    private readonly partiesService: PartiesService,
  ) {}

  @Mutation(() => Party)
  async createParty(
    @Args('createPartyInput') createPartyInput: CreatePartyInput,
    @CurrentUser() user: User
  ): Promise<Party> {
    return this.partiesService.createOne({
      ...createPartyInput,
      authors: [user]
    });
  }

  @Mutation(() => Party)
  async updateParty(
    @Args({ name: 'id', type: () => String }) _id: string,
    @Args('updatePartyInput') updatePartyInput: UpdatePartyInput,
    @CurrentUser() user: User
  ): Promise<Party> {
    const party = await this.partiesService.findOne({ _id });
    const hasPermission = user.isAdmin() || party.isAuthor(user);

    if (!hasPermission) {
      throw new UnauthorizedException();
    }

    return this.partiesService.updateOne({ _id }, updatePartyInput);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Boolean)
  viewerCanEdit(
    @Parent() party: Party,
    @CurrentUser() user: User
  ) {
    return party.isAuthor(user) || user.isAdmin();
  }
}
