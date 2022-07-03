import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Document } from 'mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from './category.entity';

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

  @Field(() => Category, { nullable: true })
  @Prop({
    type: String,
    ref: 'Category',
  })
  @IsString()
  @IsOptional()
  category: string;

  @Field(() => User)
  @Prop({
    type: String,
    ref: 'User',
  })
  @IsString()
  owner: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
