import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Party } from '../../parties/entities/party.entity';
import { QuizLicense } from '../enums/quiz-license.enum';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { QuizVersion } from '../../quiz-versions/entities/quiz-version.entity';
import { QuizVerificationState } from '../enums/quiz-verification-state.enum';

@ObjectType()
@Schema()
export class QuizVerifyRequest {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'QuizVersion' })
  @Field(() => QuizVersion)
  version: QuizVersion;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Field(() => User, { nullable: true })
  moderator?: User;

  @Prop()
  @Field(() => String, { nullable: true })
  reason?: string;

  @Prop({
    enum: QuizVerificationState
  })
  @Field(() => QuizVerificationState, { defaultValue: QuizVerificationState.ACCEPTED })
  state: QuizVerificationState;
}

export const QuizVerifyRequestSchema = SchemaFactory.createForClass(QuizVerifyRequest);
