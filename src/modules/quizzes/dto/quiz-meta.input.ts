import { Field, InputType, Int } from '@nestjs/graphql';
import { Party } from '../../parties/entities/party.entity';
import { QuizLicense } from '../enums/quiz-license.enum';

@InputType()
class QuizFeaturesInput {
  @Field(() => [String])
  authorizedParties: Party[];
}

@InputType()
class QuizStatisticsInput {
  @Field(() => Int)
  surveysNumber: number;
}

@InputType()
class QuizAuthorInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  url: string;
}

@InputType()
export class QuizMetaInput {
  @Field(() => QuizFeaturesInput)
  features: QuizFeaturesInput;

  @Field(() => QuizStatisticsInput)
  statistics: QuizStatisticsInput;

  @Field(() => QuizAuthorInput)
  author: QuizAuthorInput;

  @Field(() => QuizLicense)
  license: QuizLicense;
}
