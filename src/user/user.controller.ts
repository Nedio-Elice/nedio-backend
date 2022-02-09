import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Put,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { User, UserDocument } from '../user/schema/user.schema';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GalleryService } from '../gallery/gallery.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
    private readonly galleryService: GalleryService,
  ) {}

  // @UseGuards(JwtAuthGuard) @Request() req, req.user.email로 토큰의 복호화된 이메일 접근 가능
  @UseGuards(JwtAuthGuard)
  @Get('myInfo') // 자신의 정보 확인
  async getMyInfo(@Request() req): Promise<User> {
    return await this.userService.getUserByObjectId(req.user.id);
  }

  @Get(':id') // 특정 User 데이터 조회(objectId로 조회). login용도가 아닌 유저 조회용
  async getUserByObjectId(@Param('id') userObjectId: string) {
    return await this.userService.getUserByObjectId(userObjectId);
  }

  @Post('login')
  async login(@Body() userData: any, @Res() res: any) {
    const { email, nickname, profileURL } = userData;
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      const newUser = {
        email: email,
        nickname: nickname,
        profileURL: profileURL,
        contact: '연락처를 작성해주세요',
        introduce: '자기소개를 작성해주세요',
      };
      await this.userService.createUser({ ...newUser, user: newUser });
      return this.authService.login(newUser, res);
    } else return this.authService.login(user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id') // User 데이터 수정
  async updateUserById(
    @Request() req,
    @Param('id') userObjectId: string,
    @Body() updateUserData: UpdateUserDto,
    @Res() res: any,
  ) {
    try {
      if (req.user.id === userObjectId) {
        await this.userService.updateUserById(userObjectId, updateUserData);
        const user = await this.userService.getUserByObjectId(userObjectId); // updateOne은 바뀐 user를 반환하지 않아서 따로 찾음

        await this.galleryService.updateGalleriesNickname(
          userObjectId,
          user.nickname,
        );
        return res.status(200).json({
          success: true,
          message: 'update success',
          data: user,
        });
      } else {
        return res.status(403).json({
          success: false,
          message: 'not allowed option for this account',
        });
      }
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: 'error occured in progress.',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id') // User 데이터 삭제
  async deleteUserById(@Request() req, @Param('id') userObjectId: string) {
    if (req.user.id === userObjectId)
      return this.userService.deleteUserById(userObjectId);
  }
}
