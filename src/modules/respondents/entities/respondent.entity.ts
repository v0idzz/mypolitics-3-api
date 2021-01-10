import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RespondentDetails } from './respondent-details.entity';
import { BaseEntity } from '../../../shared/base/base.entity';
import { Survey } from '../../surveys/entities/survey.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Respondent extends BaseEntity {
  @Prop([String])
  @Field(() => [String])
  code: string[];

  @Prop(raw(RespondentDetails))
  @Field(() => RespondentDetails, { nullable: true })
  details?: RespondentDetails;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Survey' }] })
  @Field(() => [Survey], { nullable: 'items' })
  surveys: Survey[];
}

export type RespondentDocument = Respondent & Document;
export const RespondentSchema = SchemaFactory.createForClass(Respondent);
