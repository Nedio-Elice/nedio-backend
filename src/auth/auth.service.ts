import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User, UserDocument } from '../user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email: email }); // ID가 존재할 경우
    if (user) {
      return { result: 'success', user: user };
    } else {
      // ID 자체가 없는 경우
      return { result: 'Idfailed' };
    }
  }

  async login(userInfo: any, res: any) {
    const payload = {
      id: userInfo._id,
      email: userInfo.email,
      profileURL: userInfo.profileURL,
      nickname: userInfo.nickname,
      contact: userInfo.contact,
      introduce: userInfo.introduce,
    };
    const user = await this.userModel.findOne({ email: userInfo.email });
    const token = await this.jwtService.sign(payload);

    // 쿠키생성
    res.cookie('token', token, {
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60),
    });

    // 토큰을 다른 정보와 함께 클라이언트로 전달
    return res.status(201).json({
      success: 'success',
      message: 'ok',
      data: user,
      accessToken: token,
    });
  }
}
