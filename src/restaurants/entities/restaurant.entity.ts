import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@InputType({ isAbstract: true })
@ObjectType()
@Schema({ collection: 'restaurants' })
export class Restaurant {
  @Field((type) => String)
  @Prop()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => Boolean, { nullable: true }) // => for grahql
  @Prop({ default: true }) // => for database
  @IsOptional()
  @IsBoolean()
  isVegan: boolean;

  @Field((type) => String, { defaultValue: 'Guilan - Rasht' })
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
