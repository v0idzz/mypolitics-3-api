import { TextTranslation } from './common';
import { Ideology } from './axis';

export interface CompassMode {
  name: TextTranslation;
  horizontal: CompassAxis;
  vertical: CompassAxis;
  third?: CompassAxis;
}

interface CompassAxis {
  ideologies: CompassIdeology[];
  name: TextTranslation;
}

interface CompassIdeology {
  ideology: Ideology;
  weight: number;
}
