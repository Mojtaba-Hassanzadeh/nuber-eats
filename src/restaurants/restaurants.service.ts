import { Inject, Injectable } from '@nestjs/common';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(@Inject(Restaurant)) {}
  getAll(): Restaurant[] {
    return;
  }
}
