import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { IdeologiesService } from './ideologies.service';
import { Ideology } from './entities/ideology.entity';
import { CreateIdeologyInput } from './dto/create-ideology.input';
import { UpdateIdeologyInput } from './dto/update-ideology.input';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../shared/guards/admin.guard';

@Resolver(() => Ideology)
@UseGuards(AdminGuard)
export class IdeologiesResolver {
  constructor(
    private readonly ideologiesService: IdeologiesService,
  ) {}

  @Mutation(() => Ideology)
  async createIdeology(
    @Args('createIdeologyInput') createIdeologyInput: CreateIdeologyInput,
  ): Promise<Ideology> {
    return this.ideologiesService.createOne(createIdeologyInput);
  }

  @Mutation(() => Ideology)
  async updateIdeology(
    @Args({ name: 'id', type: () => String }) _id: string,
    @Args('updateIdeologyInput') updateIdeologyInput: UpdateIdeologyInput,
  ): Promise<Ideology> {
    return this.ideologiesService.updateOne({ _id }, updateIdeologyInput);
  }
}
