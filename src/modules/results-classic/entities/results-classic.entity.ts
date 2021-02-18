import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class ClassicAxes {
  anarchism: number;
  anthropocentrism: number;
  authoritarianism: number;
  capitalism: number;
  communism: number;
  cosmopolitanism: number;
  environmentalism: number;
  interventionism: number;
  laissezfaire: number;
  militarism: number;
  nationalism: number;
  pacifism: number;
  progressivism: number;
  traditionalism: number;
}

@Schema({ collection: 'results' })
export class ClassicResults {
  _id?: string;
  additionDate?: string;
  axes: ClassicAxes;
}

export type ClassicResultsDocument = ClassicResults & Document;
export const ClassicResultsSchema = SchemaFactory.createForClass(ClassicResults);
