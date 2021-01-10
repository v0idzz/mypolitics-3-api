import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Axis extends BaseEntity {

}

export type AxisDocument = Axis & Document;
export const AxisSchema = SchemaFactory.createForClass(Axis);
