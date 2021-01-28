import { Field, InputType } from '@nestjs/graphql';
import { Country } from '../../../shared/enums/country.enum';

@InputType()
export class CreatePartyInput {
  @Field(() => String)
  name: string;

  @Field()
  logoUrl: string;

  @Field(() => Country)
  country: Country;
}
