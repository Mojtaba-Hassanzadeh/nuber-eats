import { ApolloDriver } from '@nestjs/apollo';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from './jwt/jwt.module';
import * as Joi from 'joi';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').default('dev').required(),
        dbType: Joi.string().required(),
        dbHost: Joi.string().required(),
        dbPort: Joi.string().required(),
        dbName: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), //true,
      context: ({ req }) => ({ user: req['user'] }),
    }),
    MongooseModule.forRoot(
      `${process.env.dbType}://${process.env.dbHost}:${process.env.dbPort}/${process.env.dbName}`,
    ),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.POST });
  }
}
