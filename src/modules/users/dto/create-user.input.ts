import { InputType, Field } from '@nestjs/graphql';
import { QuizVersion } from '../../quiz-versions/entities/quiz-version.entity';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  recaptcha: string;
}
