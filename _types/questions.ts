import { TextTranslation } from './common';
import { Ideology } from './axis';
import { Party } from './party';

export interface Question {
  text: TextTranslation;
  effects: {
    agree: QuestionEffect;
    disagree: QuestionEffect;
  }
}

interface QuestionEffect {
  axes: Ideology[];
  parties: Party[];
}
