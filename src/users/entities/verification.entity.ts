import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';

export type VerificationDocument = Verification & Document;

@InputType({ isAbstract: true })
@ObjectType()
@Schema({ timestamps: true })
export class Verification extends CoreEntity {
  @Prop()
  @Field((type) => String)
  code: string;

  @Prop({
    type: String,
    ref: 'User',
  })
  @Field((type) => User)
  user: User;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);

VerificationSchema.pre('save', async function (next) {
  const ver = this as VerificationDocument;
  ver.code = uuid();
});
