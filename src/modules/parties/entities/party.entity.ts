import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';
import { Country } from '../../../shared/enums/country.enum';

@ObjectType()
@Schema({ timestamps: true })
export class Party extends BaseEntity {
  @Prop()
  @Field(() => String)
  name: string;

  @Prop()
  @Field()
  logoUrl: string;

  @Prop({ enum: Country })
  @Field(() => Country)
  country: Country;
}

export type PartyDocument = Party & Document;
export const PartySchema = SchemaFactory.createForClass(Party);
