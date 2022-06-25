import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';

enum UserRole {
  Client,
  Owner,
  Delivery,
}

// for graphql
registerEnumType(UserRole, { name: 'UserRole' });

export type UserDocument = User & Document;

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class User extends CoreEntity {
  @Prop()
  @Field((type) => String)
  email: string;

  @Prop()
  @Field((type) => String)
  password: string;

  @Prop() //{ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
