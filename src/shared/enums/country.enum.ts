import { registerEnumType } from '@nestjs/graphql';

export enum Country {
  POLAND = 'pl_PL',
  ENGLAND = 'en_UK',
  UNITED_STATES = 'en_US',
  SERBIA = 'sr_RS'
}

registerEnumType(Country, {
  name: 'Country',
});
