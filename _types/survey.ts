import { Quiz } from './quiz';

export interface Survey {
  respondentId: Respondent['id'];
  answers: number[];
  finished: boolean;
  quiz: {
    id: Quiz['id'];
    version: string;
  };
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
