import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Restaurant & Document;
@ObjectType()
@Schema({ collection: 'restaurants' })
export class Restaurant {
  @Field((type) => String)
  @Prop()
  name: string;

  @Field((type) => Boolean)
  @Prop()
  isVegan: boolean;

  @Field((type) => String)
  @Prop()
  address: string;

  @Field((type) => String)
  @Prop()
  ownerName: string;

  @Field((type) => String)
  @Prop()
  categoryName: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
