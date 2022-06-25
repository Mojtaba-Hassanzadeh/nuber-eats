import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<UserDocument>,
  ) {}

  async createAccount({ email, password, role }: CreateAccountInput) {
    try {
      const exists = await this.usersModel.findOne({ email });
      if (exists) {
        throw new Error('Email already exists');
        return;
      }
      this.usersModel.create({ email, password, role });
      // await this.usersModel.save(
      //   this.usersModel.create({ email, password, role }),
      // );
      return true;
    } catch (e) {
      return;
    }
  }
}
