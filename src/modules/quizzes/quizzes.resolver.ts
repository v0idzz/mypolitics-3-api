import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { QuizzesService } from './quizzes.service';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizInput } from './dto/create-quiz.input';
import { UpdateQuizInput } from './dto/update-quiz.input';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

@Resolver(() => Quiz)
export class QuizzesResolver {
  constructor(
    private readonly quizzesService: QuizzesService,
  ) {}

  @Mutation(() => Quiz)
  async createQuiz(
    @Args('createQuizInput') createQuizInput: CreateQuizInput,
    @Context() context: ExpressContext,
  ) {

  }

  @Query(() => Quiz, { name: 'quiz' })
  async findOne(
    @Args('slug', { type: () => String }) slug: string,
    @Context() context: ExpressContext,
  ): Promise<Quiz> {

  }

  @Mutation(() => Quiz)
  async updateQuiz(
    @Args('updateQuizInput') { id, ...updateQuizInput }: UpdateQuizInput,
    @Context() context: ExpressContext,
  ): Promise<Quiz> {

  }
}
