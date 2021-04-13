import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, Length, Matches, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Length(2, 69)
  @Field(() => String)
  name: string;

  @MaxLength(420)
  @IsEmail()
  @Field(() => String)
  email: string;

  @MinLength(6)
  @Matches(/[A-Z]/)
  @Field(() => String)
  password: string;

  @Field(() => String)
  recaptcha: string;
}
