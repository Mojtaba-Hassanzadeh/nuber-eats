import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';

@ObjectType()
@Schema()
export class CoreEntity {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuid();
    },
  })
  @Field(() => String)
  _id: string;
}
