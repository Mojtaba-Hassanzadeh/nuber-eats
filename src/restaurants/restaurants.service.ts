import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { Category, CategoryDocument } from './entities/category.entity';
import { Restaurant, RestaurantDocument } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantsModel: Model<RestaurantDocument>,
    @InjectModel(Category.name)
    private readonly categoriesModel: Model<CategoryDocument>,
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
      const categoryName = createRestaurantInput.categoryName
        .trim()
        .toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      let category = await this.categoriesModel.findOne({
        slug: categorySlug,
      });
      if (!category) {
        category = await this.categoriesModel.create({
          name: categoryName,
          slug: categorySlug,
        });
      }
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
}
