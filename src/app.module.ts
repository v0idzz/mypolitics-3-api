import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLFederationModule, GraphQLGatewayModule, GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

import { MinioModule } from './modules/minio/minio.module';

import graphqlConfig from './config/graphql.config';
import graphqlGatewayConfig from './config/graphql-gateway.config';
import mongooseConfig from './config/mongoose.config';
import { PubSubModule } from './modules/pubsub/pubsub.module';
import { RespondentsModule } from './modules/respondents/respondents.module';
import { SurveysModule } from './modules/surveys/surveys.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [ConfigModule.forFeature(graphqlConfig)],
      useFactory: async (configService: ConfigService) => (
        configService.get('graphql')
      ),
      inject: [ConfigService],
    }),
    GraphQLGatewayModule.forRootAsync({
      imports: [ConfigModule.forFeature(graphqlGatewayConfig)],
      useFactory: async (configService: ConfigService) => (
        configService.get('graphql-gateway')
      ),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(mongooseConfig)],
      useFactory: async (configService: ConfigService) => (
        configService.get('mongoose')
      ),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(),
    MinioModule,
    PubSubModule,
    RespondentsModule,
    SurveysModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})

export class AppModule {}
