import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { Headers } from '../../constants';

export const isAdmin = (context: ExpressContext): boolean => {
  const adminHeader = context.req.headers[Headers.ADMIN];
  if (!adminHeader || typeof adminHeader !== 'string') {
    return false;
  }

  return adminHeader === process.env.ADMIN_CODE;
};
