import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { v4 as uuid } from 'uuid';
import mongoose from 'mongoose';

@ObjectType()
@Schema()
export class CoreEntity {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuid();
    },
  })
  @Field((type) => String)
  _id: string;
}
