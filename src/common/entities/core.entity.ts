import { Field } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';

export class CoreEntity {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuid();
    },
  })
  @Field((type) => String)
  id: string;

  @Prop()
  @Field((type) => Date)
  createdAt: Date;

  @Prop()
  @Field((type) => Date)
  updatedAt: Date;
}
