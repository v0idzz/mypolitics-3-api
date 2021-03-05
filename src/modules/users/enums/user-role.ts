import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  REGULAR = 'REGULAR',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});
