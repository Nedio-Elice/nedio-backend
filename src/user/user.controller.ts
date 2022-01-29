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
import { User } from './schema/user.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get() // 모든 User 데이터 조회
  async getAllUser(): Promise<User[]> {
    return await this.userService.getAllUser();
  }

  @Get(':id') // 특정 User 데이터 조회(objectId로 조회). login용도가 아닌 유저 조회용
  async getUserByObjectId(@Param('id') userObjectId: string): Promise<User> {
    return await this.userService.getUserByObjectId(userObjectId);
  }

  // 로그인 및 jwt토큰이 발급됨. 만약 기존 회원이 존재하지 않을 경우 새로 회원가입, jwt 발급까지 처리
  @UseGuards(LocalAuthGuard) // 해당 guard 통과시 req 객체에 결과가 할당됨
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: any) {
    // console.log(req.user); req에서 유저 정보만 담김
    if (req.user.result === 'success') {
      // ID 확인 됐을 경우(존재하는 회원일 경우) 유저 정보가 authService의 login 함수에 넘어감.
      // { result: 'success', access_token: token} 의 형태로 리턴되야함
      return this.authService.login(req.user.user, res);
    }
  }

  @Post() // User 데이터 생성(예시용). 필요없을 것 같으나 혹시 모르기에 남겨둠
  async createUser(@Body() userData: CreateUserDto) {
    console.log(userData);
    return await this.userService.createUser(userData);
  }

  @Put(':id') // User 데이터 수정
  async updateUserById(
    @Param('id') userObjectId: string,
    @Body() updateUserData: UpdateUserDto,
  ) {
    return this.userService.updateUserById(userObjectId, updateUserData);
  }

  @Delete(':id') // User 데이터 삭제
  async deleteUserById(@Param('id') userObjectId: string) {
    return this.userService.deleteUserById(userObjectId);
  }
}
