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

  @UseGuards(JwtAuthGuard)
  @Get('myInfo')
  async getMyInfo(@Request() req): Promise<User> {
    return await this.userService.getUserByObjectId(req.user.id);
  }

  @Get(':id')
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
      const user2 = await this.userModel.findOne({ email: email });
      return this.authService.login(user2, res);
    } else return this.authService.login(user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUserById(
    @Request() req,
    @Param('id') userObjectId: string,
    @Body() updateUserData: UpdateUserDto,
    @Res() res: any,
  ) {
    try {
      if (req.user.id === userObjectId) {
        await this.userService.updateUserById(userObjectId, updateUserData);
        const user = await this.userService.getUserByObjectId(userObjectId);

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
  @Delete(':id')
  async deleteUserById(@Request() req, @Param('id') userObjectId: string) {
    if (req.user.id === userObjectId)
      return this.userService.deleteUserById(userObjectId);
  }
}
