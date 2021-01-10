import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AxesService } from './axes.service';
import { Axis } from './entities/axis.entity';
import { CreateAxisInput } from './dto/create-axis.input';
import { UpdateAxisInput } from './dto/update-axis.input';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

@Resolver(() => Axis)
export class AxesResolver {
  constructor(
    private readonly axesService: AxesService,
  ) {}

  @Mutation(() => Axis)
  async createAxis(
    @Args('createAxisInput') createAxisInput: CreateAxisInput,
    @Context() context: ExpressContext,
  ): Promise<Axis> {

  }

  @Mutation(() => Axis)
  async updateAxis(
    @Args('updateAxisInput') updateAxisInput: UpdateAxisInput,
    @Context() context: ExpressContext,
  ): Promise<Axis> {

  }
}
