import { Resolver, Mutation, Args, ResolveField, Parent, Context, GqlExecutionContext } from '@nestjs/graphql';
import { IdeologiesService } from './ideologies.service';
import { Ideology } from './entities/ideology.entity';
import { CreateIdeologyInput } from './dto/create-ideology.input';
import { UpdateIdeologyInput } from './dto/update-ideology.input';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Ideology)
@UseGuards(GqlAuthGuard)
export class IdeologiesResolver {
  constructor(
    private readonly ideologiesService: IdeologiesService,
  ) {}

  @Mutation(() => Ideology)
  async createIdeology(
    @Args('createIdeologyInput') createIdeologyInput: CreateIdeologyInput,
    @CurrentUser() user: User,
  ): Promise<Ideology> {
    return this.ideologiesService.createOne({
      ...createIdeologyInput,
      authors: [user]
    });
  }

  @Mutation(() => Ideology)
  async updateIdeology(
    @Args({ name: 'id', type: () => String }) _id: string,
    @Args('updateIdeologyInput') updateIdeologyInput: UpdateIdeologyInput,
    @CurrentUser() user: User,
  ): Promise<Ideology> {
    const ideology = await this.ideologiesService.findOne({ _id });
    const hasPermission = user.isAdmin() || ideology.isAuthor(user);

    if (!hasPermission) {
      throw new UnauthorizedException();
    }

    return this.ideologiesService.updateOne({ _id }, updateIdeologyInput);
  }

  @ResolveField(() => Boolean)
  viewerCanEdit(
    @Parent() ideology: Ideology,
    @CurrentUser() user: User,
  ) {
    return ideology.isAuthor(user) || user.isAdmin();
  }
}
