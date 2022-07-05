import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, Length } from 'class-validator';
import { Document } from 'mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Restaurant } from './restaurant.entity';

export type CategoryDocument = Category & Document;

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Schema({ timestamps: true })
export class Category extends CoreEntity {
  @Field(() => String)
  @Prop({ unique: true })
  @IsString()
  @Length(5)
  name: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  @IsString()
  coverImg: string;

  @Field(() => String)
  @Prop({ unique: true })
  @IsString()
  slug: string;

  @Field(() => [Restaurant], { nullable: true })
  @Prop({ type: [{ type: String, ref: 'Restaurant' }] })
  restaurants: Restaurant[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
