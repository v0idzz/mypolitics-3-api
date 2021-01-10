import { CountryCode } from './common';

export interface Party {
  name: string;
  logo: string;
  parliament: boolean;
  country: CountryCode;
}
