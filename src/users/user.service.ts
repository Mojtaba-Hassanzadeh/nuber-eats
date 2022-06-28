import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User, UserDocument } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const exists = await this.usersModel.findOne({ email });
      if (exists) {
        return { ok: false, error: 'Email already exists' };
      }
      (await this.usersModel.create({ email, password, role })).save();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Can't create account" };
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const user = await this.usersModel.findOne({ email });
      if (!user) {
        return { ok: false, error: 'User not found' };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return { ok: false, error: 'Wrong password' };
      }
      const token = this.jwtService.sign(user.id);
      return { ok: true, token };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async findById(id: string): Promise<UserDocument> {
    return this.usersModel.findById(id);
  }
}
