import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant, RestaurantDocument } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantsModel: Model<RestaurantDocument>,
  ) {}
  getAll(): Promise<Restaurant[]> {
    return this.restaurantsModel.find().exec();
  }
  createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    // const newRestaurant = this.restaurantsModel.create(createRestaurantDto);
    return this.restaurantsModel.create(createRestaurantDto);
  }

  updtaeRestaurant({ id, data }: UpdateRestaurantDto) {
    return this.restaurantsModel.updateOne({ _id: id }, { ...data });
  }
}
