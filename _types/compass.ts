import { TextTranslation } from './common';
import { AxisIdeology } from './axis';

export interface CompassMode {
  name: TextTranslation;
  horizontal: CompassAxis;
  vertical: CompassAxis;
  third: CompassAxis;
}

interface CompassAxis {
  ideologies: CompassAxisIdeology[];
  name: TextTranslation;
}

interface CompassAxisIdeology {
  ideology: AxisIdeology;
  weight: number;
}
