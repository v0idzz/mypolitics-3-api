import { TextTranslation } from './common';
import { Axis } from './axis';
import { Question } from './questions';
import { CompassMode } from './compass';

export interface Quiz {
  id: string;
  title: TextTranslation;
  description: TextTranslation;
  currentVersion: string;
  versions: Record<string, QuizVersion>;
}

interface QuizVersion {
  publishedOn?: Date;
  axes: Axis[];
  questions: Question[];
  compass?: CompassMode;
}
