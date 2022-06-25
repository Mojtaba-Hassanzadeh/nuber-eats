import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRestaurantDto } from './create-restaurant.dto';

@InputType()
class UpdateRestaurantInputType extends PartialType(CreateRestaurantDto) {}

@InputType()
export class UpdateRestaurantDto {
  @Field((type) => String)
  id: string;

  @Field((type) => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType;
}
