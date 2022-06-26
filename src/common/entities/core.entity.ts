import { Field } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { v4 as uuid } from 'uuid';
import mongoose from 'mongoose';

export class CoreEntity {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuid();
    },
  })
  @Field((type) => mongoose.Schema.Types.ObjectId)
  _id: ObjectId;
}
