import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Ideology } from '../../ideologies/entities/ideology.entity';
import * as mongoose from 'mongoose';

@ObjectType()
@Schema()
export class QuizCompassIdeology {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Ideology' })
  @Field(() => Ideology)
  ideology: Ideology;

  @Prop(mongoose.Schema.Types.Number)
  @Field(() => Int)
  weight: number;
}

export const QuizCompassIdeologySchema = SchemaFactory.createForClass(QuizCompassIdeology);
