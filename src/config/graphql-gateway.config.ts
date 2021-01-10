import { registerAs } from '@nestjs/config';

export default registerAs('graphql-gateway', () => ({
  server: {
    cors: true,
    autoSchemaFile: 'schema.gql',
    path: '/gateway',
  },
  gateway: {
    serviceList: [
      { name: 'admin', url: process.env.ADMIN_SCHEMA_URL },
    ],
  },
}));
