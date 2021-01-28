import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { GATEWAY_BUILD_SERVICE } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { Headers } from '../../constants';
import { GraphQLRequestContext } from 'apollo-server-types';

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }: GraphQLRequestContext) {
    if (!context.req) {
      return;
    }

    const setHeaders = (names: string[]) => (
      names.forEach((name) => {
        const value = context.req.headers[name];


        if (value) {
          request.http.headers.set(name, value);
        }
      })
    );

    setHeaders([Headers.ADMIN, Headers.RESPONDENT]);
  }
}

@Module({
  providers: [
    {
      provide: AuthenticatedDataSource,
      useValue: AuthenticatedDataSource,
    },
    {
      provide: GATEWAY_BUILD_SERVICE,
      useFactory: (AuthenticatedDataSource) => {
        return ({ url }) => new AuthenticatedDataSource({ url });
      },
      inject: [AuthenticatedDataSource],
    },
  ],
  exports: [GATEWAY_BUILD_SERVICE],
})
export class BuildServiceModule {}
