import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLGatewayModule, GraphQLFederationModule, GATEWAY_BUILD_SERVICE } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

import { MinioModule } from './modules/minio/minio.module';
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
import { RespondentsService } from './modules/respondents/respondents.service';
import { Respondent, RespondentSchema } from './modules/respondents/entities/respondent.entity';
import { UploadModule } from './modules/upload/upload.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

import graphqlConfig from './config/graphql.config';
import graphqlGatewayConfig from './config/graphql-gateway.config';
import mongooseConfig from './config/mongoose.config';
import mailConfig from './config/mail.config';
import { UtilsModule } from './modules/utils/utils.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Respondent.name, schema: RespondentSchema },
    ], 'main'),
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
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongoose.mainUri'),
      }),
      connectionName: 'main',
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(mongooseConfig)],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongoose.classicUri'),
      }),
      connectionName: 'classic',
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule.forFeature(mailConfig)],
      useFactory: async (configService: ConfigService) => ({
        transport: configService.get('mail.transport'),
        defaults: {
          from:'"myPolitics" <no-reply@mypolitics.pl>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
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
    UploadModule,
    AuthModule,
    UsersModule,
    UtilsModule,
  ],
  controllers: [],
  providers: [RespondentsService, Logger],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RespondentMiddleware, IsAdminMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.ALL
    });
  }
}
