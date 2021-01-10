import { InputType, Field } from '@nestjs/graphql';
import { RespondentDetailsInput } from './respondent-details.input';

@InputType()
export class UpdateRespondentInput {
  @Field(() => RespondentDetailsInput)
  details: RespondentDetailsInput;
}
