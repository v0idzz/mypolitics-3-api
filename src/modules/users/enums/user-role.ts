import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  REGULAR = 'REGULAR',
  ADMIN = 'ADMIN',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});
