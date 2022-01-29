import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAllUser(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getUserById(userId: string) {
    // objectId가 아니라 이메일로 찾는 함수
    return await this.userModel.findOne({ email: userId });
  }

  async getUserByObjectId(userObjectId: string) {
    // 이메일이 아니라 object로 찾는 함수
    return await this.userModel.findOne({ _id: userObjectId }); // 이 부분에서 email이랑 id랑 헷갈릴 수 있는데 어떻게 할지 나중에 논의해봐야할 듯
  }

  async createUser(userData: CreateUserDto) {
    return await this.userModel.create({ ...userData }); // 만약 유저 생성에서 추가해줘야할 것이 있을 경우 이 부분에서 추가
  }

  async updateUserById(userObjectId: string, updateUserData: UpdateUserDto) {
    try {
      await this.userModel
        .where({ _id: userObjectId })
        .updateOne(updateUserData);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async deleteUserById(userObjectId: string) {
    try {
      await this.userModel.deleteOne({ _id: userObjectId });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
