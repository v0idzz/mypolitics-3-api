import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PartiesService } from './parties.service';
import { Party } from './entities/party.entity';
import { CreatePartyInput } from './dto/create-party.input';
import { UpdatePartyInput } from './dto/update-party.input';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../shared/guards/admin.guard';

@Resolver(() => Party)
@UseGuards(AdminGuard)
export class PartiesResolver {
  constructor(
    private readonly partiesService: PartiesService,
  ) {}

  @Mutation(() => Party)
  async createParty(
    @Args('createPartyInput') createPartyInput: CreatePartyInput,
  ): Promise<Party> {
    return this.partiesService.createOne(createPartyInput);
  }

  @Mutation(() => Party)
  async updateParty(
    @Args({ name: 'id', type: () => String }) _id: string,
    @Args('updatePartyInput') updatePartyInput: UpdatePartyInput,
  ): Promise<Party> {
    return this.partiesService.updateOne({ _id }, updatePartyInput);
  }
}
