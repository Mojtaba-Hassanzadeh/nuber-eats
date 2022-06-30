import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CoreEntity } from 'src/common/entities/core.entity';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Verification } from './verification.entity';

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
@Schema({ timestamps: true })
export class User extends CoreEntity {
  @Prop()
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  @Field((type) => String)
  @IsString()
  password: string;

  @Prop()
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Prop({ default: false })
  @Field((type) => Boolean)
  verified: boolean;

  checkPassword: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  const user = this as UserDocument;
  if (!user.password) {
    next();
    return;
  }
  if (!user.isModified('password')) return next();
  try {
    user.password = await bcrypt.hash(user.password, 10);
    return next();
  } catch (e) {
    return next(e);
    throw new InternalServerErrorException();
  }
});

UserSchema.methods.checkPassword = async function checkPassword(aPassword) {
  try {
    return await bcrypt.compare(aPassword, this.password);
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException(error);
  }
};
