import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from './entities/restaurant.entity';
import { RestaurantResolver } from './restaurants.resolver';
import { RestaurantService } from './restaurants.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  providers: [RestaurantResolver, RestaurantService],
})
export class RestaurantsModule {}
