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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// auth 관련
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// 현재 db에 잘 들어가는지 postman으로 확인 중이라 return 값으로 생성한 정보가 출력됨. 나중에 설계한 api에 맞게 return값 수정할 것
// 현재는 요청 경로에 params로 id가 들어가지만 나중에 jwt에 맞게 수정해야함. 일단은 objectId로

@Controller('users') // "/user (/api/users)" 이후에 들어오는 요청을 이 컨틀롤러에서 처리하겠다는 의미
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  // @UseGuards(JwtAuthGuard) @Request() req, req.user.email로 토큰의 복호화된 이메일 접근 가능

  @Get() // 모든 User 데이터 조회
  async getAllUser(): Promise<User[]> {
    return await this.userService.getAllUser();
  }

  @UseGuards(JwtAuthGuard)
  @Get('myInfo') // 모든 User 데이터 조회
  async getMyInfo(@Request() req): Promise<User> {
    return await this.userService.getUserByObjectId(req.user.id);
  }

  @Get(':id') // 특정 User 데이터 조회(objectId로 조회). login용도가 아닌 유저 조회용
  async getUserByObjectId(@Param('id') userObjectId: string) {
    return await this.userService.getUserByObjectId(userObjectId);
  }

  // 로그인 및 jwt토큰이 발급됨. 만약 기존 회원이 존재하지 않을 경우 새로 회원가입, jwt 발급까지 처리
  // @UseGuards(LocalAuthGuard) // 해당 guard 통과시 req 객체에 결과가 할당됨
  // 현재 nest의 passport는 usernamefield, passwordfield 두 개만 사용가능함으로 이메일, 프로필경로, 닉네임 세 개를 수용하기엔 부족함
  // 따라서 passport를 적용하지 않고 따로 로직을 구성하는 것으로 대체
  @Post('login')
  async login(@Body() userData: any, @Res() res: any) {
    const { email, nickname, profileURL } = userData;
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      const newUser = {
        email: email,
        nickname: nickname,
        profileURL: profileURL,
        contact: '자기소개를 작성해주세요',
        introduce: '연락처를 작성해주세요',
      };
      await this.userService.createUser({ ...newUser, user: newUser });
      return this.authService.login(newUser, res);
    } else return this.authService.login(user, res);
    // console.log(req.user); req에서 유저 정보만 담김
    //if (req.user.result === 'success') {
    // ID 확인 됐을 경우(존재하는 회원일 경우) 유저 정보가 authService의 login 함수에 넘어감.
    // { result: 'success', access_token: token} 의 형태로 리턴되야함
    //  return this.authService.login(req.user.user, res);
    //}
  }

  @Post() // User 데이터 생성(예시용). 필요없을 것 같으나 혹시 모르기에 남겨둠
  async createUser(@Body() userData: CreateUserDto) {
    console.log(userData);
    return await this.userService.createUser(userData);
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
        console.log(user);
        res.status(200).json({
          success: true,
          message: 'update success',
          data: user,
        });
      } else {
        res.status(403).json({
          success: false,
          message: 'not allowed option for this account',
        });
      }
    } catch (e) {
      res.status(400).json({
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
