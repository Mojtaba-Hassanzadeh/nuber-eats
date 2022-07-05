import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Restaurant } from './restaurant.entity';

//-------------
@InputType('DishChoiceInputType', { isAbstract: true })
@ObjectType()
export class DishChoice {
  @Field(() => String)
  name: string;
  @Field(() => Int, { nullable: true })
  extra?: number;
}

// -------------
@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
export class DishOption {
  @Field(() => String)
  name: string;
  @Field(() => [DishChoice], { nullable: true })
  choices?: DishChoice[];
  @Field(() => Int, { nullable: true })
  extra?: number;
}

// -------------
export type DishDocument = Dish & Document;

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Schema()
export class Dish extends CoreEntity {
  @Field(() => String)
  @Prop()
  @IsString()
  @Length(5)
  name: string;

  @Field(() => Int)
  @Prop()
  @IsNumber()
  price: number;

  @Field(() => String, { nullable: true })
  @Prop({ nullable: true })
  @IsString()
  photo: string;

  @Field(() => String)
  @Prop()
  @Length(5, 140)
  description: string;

  @Field(() => Restaurant)
  @Prop({ type: { type: String, ref: 'Restaurant' } })
  restaurant: Restaurant;

  //   @RelationId((dish: Dish) => dish.restaurant)
  //   restaurantId: number;

  @Field(() => [DishOption], { nullable: true })
  @Prop({ type: Object, nullable: true })
  options?: DishOption[];
}

export const DishSchema = SchemaFactory.createForClass(Dish);
