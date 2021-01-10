import { registerEnumType } from '@nestjs/graphql';

export enum Language {
  POLISH = 'pl',
  ENGLISH = 'en',
}

registerEnumType(Language, {
  name: 'Language',
});
