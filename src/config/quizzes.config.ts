import { registerAs } from '@nestjs/config';

export default registerAs('quizzes', () => ({
  featuredSlugs: (process.env.FEATURED_QUIZZES_SLUGS_ARRAY || '').split(','),
}));
