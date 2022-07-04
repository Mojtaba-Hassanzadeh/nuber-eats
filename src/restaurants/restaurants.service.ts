import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { Category, CategoryDocument } from './entities/category.entity';
import { Restaurant, RestaurantDocument } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantsModel: Model<RestaurantDocument>,
    private readonly categoriesModel: CategoryRepository,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = await this.restaurantsModel.create(
        createRestaurantInput,
      );
      newRestaurant.owner = owner;
      const category = await this.categoriesModel.getOrCreate(
        createRestaurantInput.categoryName,
      );
      newRestaurant.category = category;

      await this.restaurantsModel.create(newRestaurant);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not create restaurant',
      };
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant: Restaurant = await this.restaurantsModel.findOne({
        _id: editRestaurantInput.restaurantId,
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      if (owner._id !== restaurant.owner.toString()) {
        return {
          ok: false,
          error: `You can't edit this restaurant`,
        };
      }
      let category: Category = restaurant.category;
      if (editRestaurantInput.categoryName) {
        category = await this.categoriesModel.getOrCreate(
          editRestaurantInput.categoryName,
        );
      }
      await this.restaurantsModel.findOneAndUpdate(
        { _id: editRestaurantInput.restaurantId },
        {
          ...editRestaurantInput,
          category,
        },
      );
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not edit restaurant',
      };
    }
  }
}
