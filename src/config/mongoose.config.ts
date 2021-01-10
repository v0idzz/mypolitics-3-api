import { registerAs } from '@nestjs/config';

export default registerAs('mongoose', () => ({
  uri: process.env.MONGO_URL,
}));
