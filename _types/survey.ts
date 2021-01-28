import { Quiz } from './quiz';
import { Question } from './questions';

export interface Survey {
  respondentId: Respondent['id'];
  answers: SurveyAnswer[];
  finished: boolean;
  quiz: {
    id: Quiz['id'];
    version: string;
  };
}

export interface SurveyAnswer {
  question: Question;
  type: 'AGREE' | 'DISAGREE' | 'NEUTRAL';
  weight: number;
}

export interface Respondent {
  id: string;
  code: string[];
  surveys: Survey[];
  additionalInfo?: {
    ideology: string;
    compassPoint: [number, number];
  }
}
