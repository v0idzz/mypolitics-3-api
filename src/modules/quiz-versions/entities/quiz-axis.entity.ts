import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Ideology } from '../../ideologies/entities/ideology.entity';
import { TextTranslation } from '../../../shared/entities/text-translation.entity';

@ObjectType()
@Schema()
export class QuizAxis {
  @Field({ name: 'id' })
  _id: string;

  @Prop(raw(TextTranslation))
  @Field(() => TextTranslation, { nullable: true })
  name?: TextTranslation;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Ideology' })
  @Field(() => Ideology)
  left: Ideology;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Ideology' })
  @Field(() => Ideology)
  right: Ideology;
}

export const QuizAxisSchema = SchemaFactory.createForClass(QuizAxis);
