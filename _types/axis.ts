import { TextTranslation } from './common';

export interface Axis {
  name?: string;
  left: AxisIdeology;
  right: AxisIdeology;
}

export interface AxisIdeology {
  name: TextTranslation;
  description: TextTranslation;
  color: string;
  icon: {
    type: 'font-awesome' | 'url';
    value: string;
  };
}
