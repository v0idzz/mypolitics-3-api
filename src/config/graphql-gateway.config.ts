import { registerAs } from '@nestjs/config';
export default registerAs('graphql-gateway', () => ({
  server: {
    cors: true,
    context: ({ req, res }) => ({ req, res }),
  },
  gateway: {
    serviceList: [
      { name: 'admin', url: process.env.ADMIN_SCHEMA_URL },
      { name: 'local', url: process.env.LOCAL_SCHEMA_URL },
    ],
  },
}));
