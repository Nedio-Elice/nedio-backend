import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUserByObjectId(userObjectId: string): Promise<User> {
    return await this.userModel.findOne({ _id: userObjectId });
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    return await this.userModel.create({ ...userData });
  }

  async updateUserById(
    userObjectId: string,
    updateUserData: UpdateUserDto,
  ): Promise<any> {
    return await this.userModel
      .where({ _id: userObjectId })
      .updateOne(updateUserData);
  }

  async deleteUserById(userObjectId: string): Promise<any> {
    return await this.userModel.deleteOne({ _id: userObjectId });
  }
}
