import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/nuber-eats'),
    RestaurantsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
