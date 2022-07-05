import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dtos/search-restaurant.dto';
import { Category, CategoryDocument } from './entities/category.entity';
import { Dish, DishDocument } from './entities/dish.entity';
import { Restaurant, RestaurantDocument } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantsModel: Model<RestaurantDocument>,
    private readonly categoriesModel: CategoryRepository,
    @InjectModel(Category.name)
    private readonly categories: Model<CategoryDocument>,
    @InjectModel(Dish.name)
    private readonly dishesModel: Model<DishDocument>,
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

  async deleteRestaurant(
    owner: User,
    deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    // TODO: remove Repeatative codes in this function
    try {
      const restaurant: Restaurant = await this.restaurantsModel.findOne({
        _id: deleteRestaurantInput.restaurantId,
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
          error: `You can't delete this restaurant`,
        };
      }
      await this.restaurantsModel.findOneAndDelete({
        _id: deleteRestaurantInput.restaurantId,
      });
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not delete restaurant',
      };
    }
  }

  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not load categories',
      };
    }
  }

  async countRestaurants(category: Category) {
    const [results] = await this.restaurantsModel.aggregate([
      {
        $match: {
          category: {
            $eq: category._id,
          },
        },
      },
      {
        $group: {
          _id: '$category',
          count: {
            $sum: 1,
          },
        },
      },
    ]);
    return results?.count || 0;
  }

  async findCategoryBySlug({
    slug,
    page,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({ slug });
      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        };
      }
      const restaurants = await this.restaurantsModel
        .find(
          {
            category: category._id,
          },
          {
            limit: 25,
            skip: (page - 1) * 25,
          },
        )
        .populate('category');
      // TODO: get restaurants by their ids
      category.restaurants = restaurants;
      const totalResults = await this.countRestaurants(category);
      return {
        ok: true,
        category,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not load category',
      };
    }
  }

  async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      const restaurants = await this.restaurantsModel.find({
        skip: (page - 1) * 3,
        take: 3,
        order: {
          createdAt: 'DESC',
        },
      });
      const totalResults = await this.restaurantsModel.countDocuments();
      return {
        ok: true,
        results: restaurants,
        totalPages: Math.ceil(totalResults / 3),
        totalResults,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not load restaurants',
      };
    }
  }

  async findRestaurantById({
    restaurantId,
  }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.restaurantsModel.findOne({
        _id: restaurantId,
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      return {
        ok: true,
        restaurant,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not find restaurant',
      };
    }
  }

  async searchRestaurantByName({
    query,
    page,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      const restaurants = await this.restaurantsModel.find(
        {
          name: {
            $regex: query,
            $options: 'i',
          },
        },
        {
          limit: 25,
          skip: (page - 1) * 25,
        },
      );
      console.log(restaurants);
      const totalResults = await this.restaurantsModel.countDocuments();
      return {
        ok: true,
        restaurants,
        totalResults,
        totalPages: Math.ceil(totalResults / 2),
      };
    } catch {
      return { ok: false, error: 'Could not search for restaurants' };
    }
  }

  async createDish(
    owner: User,
    createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    try {
      const restaurant: Restaurant = await this.restaurantsModel.findOne({
        _id: createDishInput.restaurantId,
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
          error: "You can't do that.",
        };
      }
      await this.dishesModel.create({ ...createDishInput, restaurant });
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Could not create dish',
      };
    }
  }
}
