import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Document } from 'mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from './category.entity';
import { Dish } from './dish.entity';

export type RestaurantDocument = Restaurant & Document;

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Schema({ timestamps: true })
export class Restaurant extends CoreEntity {
  @Field(() => String)
  @Prop()
  @IsString()
  @Length(5)
  name: string;

  @Field(() => String)
  @Prop()
  @IsString()
  coverImg: string;

  @Field(() => String)
  @Prop()
  @IsString()
  address: string;

  @Field(() => Category, { nullable: true })
  @Prop({
    type: String,
    ref: 'Category',
    required: false,
  })
  category: Category;

  @Field(() => User)
  @Prop({
    type: String,
    ref: 'User',
  })
  owner: User;

  @Field(() => [Dish])
  @Prop([{ type: { type: String, ref: 'Dish' } }])
  menu: Dish[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
