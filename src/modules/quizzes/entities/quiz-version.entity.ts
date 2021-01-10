import { ObjectType } from '@nestjs/graphql';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../../../shared/base/base.entity';

@ObjectType()
@Schema({ timestamps: true })
export class QuizVersion extends BaseEntity {

}

export type QuizVersionDocument = QuizVersion & Document;
export const QuizVersionSchema = SchemaFactory.createForClass(QuizVersion);
