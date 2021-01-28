import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Ideology } from '../../ideologies/entities/ideology.entity';
import { Party } from '../../parties/entities/party.entity';

@ObjectType()
@Schema()
export class QuestionPositiveEffect {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Ideology' }] })
  @Field(() => [Ideology], { nullable: 'items' })
  ideologies: Ideology[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Party' }] })
  @Field(() => [Party], { nullable: 'items' })
  parties: Party[];
}

export const QuestionPositiveEffectSchema = SchemaFactory.createForClass(QuestionPositiveEffect);
