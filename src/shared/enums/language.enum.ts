import { registerEnumType } from '@nestjs/graphql';

export enum Language {
  POLISH = 'pl',
  ENGLISH = 'en',
  SERBIAN = 'sr',
}

registerEnumType(Language, {
  name: 'Language',
});
