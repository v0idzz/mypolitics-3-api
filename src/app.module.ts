import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLGatewayModule, GraphQLFederationModule, GATEWAY_BUILD_SERVICE } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

import { MinioModule } from './modules/minio/minio.module';
import graphqlConfig from './config/graphql.config';
import graphqlGatewayConfig from './config/graphql-gateway.config';
import mongooseConfig from './config/mongoose.config';
import { PubSubModule } from './modules/pubsub/pubsub.module';
import { RespondentsModule } from './modules/respondents/respondents.module';
import { SurveysModule } from './modules/surveys/surveys.module';
import { IsAdminMiddleware } from './shared/middleware/is-admin.middleware';
import { RespondentMiddleware } from './shared/middleware/respondent.middleware';
import { IdeologiesModule } from './modules/ideologies/ideologies.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { QuizVersionsModule } from './modules/quiz-versions/quiz-versions.module';
import { PartiesModule } from './modules/parties/parties.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { ResultsModule } from './modules/results/results.module';
import { BuildServiceModule } from './modules/build-service/build-service.module';

@Module({
  imports: [
    GraphQLFederationModule.forRootAsync({
      imports: [ConfigModule.forFeature(graphqlConfig)],
      useFactory: async (configService: ConfigService) => (
        configService.get('graphql')
      ),
      inject: [ConfigService],
    }),
    GraphQLGatewayModule.forRootAsync({
      imports: [
        ConfigModule.forFeature(graphqlGatewayConfig),
        BuildServiceModule
      ],
      useFactory: async (configService: ConfigService) => (
        configService.get('graphql-gateway')
      ),
      inject: [ConfigService, GATEWAY_BUILD_SERVICE],
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
    SurveysModule,
    QuizzesModule,
    IdeologiesModule,
    QuizVersionsModule,
    PartiesModule,
    QuestionsModule,
    ResultsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsAdminMiddleware).forRoutes('*');
    consumer.apply(RespondentMiddleware).forRoutes('*');
  }
}
