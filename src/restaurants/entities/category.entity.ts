import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { string } from 'joi';
import { Document } from 'mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Restaurant } from './restaurant.entity';

export type CategoryDocument = Category & Document;

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Schema({ timestamps: true })
export class Category extends CoreEntity {
  @Field((type) => String)
  @Prop()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => String)
  @Prop()
  @IsString()
  coverImg: string;

  @Field((type) => [Restaurant])
  @Prop({ type: [{ type: String, ref: 'Restaurant' }] })
  restaurants: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
