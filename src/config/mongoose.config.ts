import { registerAs } from '@nestjs/config';

export default registerAs('mongoose', () => ({
  mainUri: process.env.MONGO_URL,
  classicUri: process.env.CLASSIC_MONGO_URL,
}));
