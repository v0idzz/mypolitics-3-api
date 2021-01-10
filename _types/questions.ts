import { TextTranslation } from './common';
import { AxisIdeology } from './axis';
import { Party } from './party';

export interface Question {
  text: TextTranslation;
  effects: {
    agree: QuestionEffect;
    disagree: QuestionEffect;
  }
}

interface QuestionEffect {
  axes: AxisIdeology[];
  parties: Party[];
}
