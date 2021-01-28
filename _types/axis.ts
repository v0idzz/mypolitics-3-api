import { TextTranslation } from './common';

export interface Axis {
  name?: string;
  left: Ideology;
  right: Ideology;
}

export interface Ideology {
  name: TextTranslation;
  description: TextTranslation;
  color: string;
  icon: {
    type: 'font-awesome' | 'url';
    value: string;
  };
}
