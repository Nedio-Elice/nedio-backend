import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Put,
} from '@nestjs/common';
import { User } from './schema/user.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// 현재 db에 잘 들어가는지 postman으로 확인 중이라 return 값으로 생성한 정보가 출력됨. 나중에 설계한 api에 맞게 return값 수정할 것
// 현재는 요청 경로에 params로 id가 들어가지만 나중에 jwt에 맞게 수정해야함. 일단은 objectId로

@Controller('user') // "/user (/api/user)" 이후에 들어오는 요청을 이 컨틀롤러에서 처리하겠다는 의미
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get() // 모든 User 데이터 조회
  async getAllUser(): Promise<User[]> {
    return await this.userService.getAllUser();
  }

  @Get(':id') // 특정 User 데이터 조회
  async getUserById(@Param('id') userObjectId: string): Promise<User> {
    console.log(userObjectId);
    return await this.userService.getUserById(userObjectId);
  }

  @Post() // User 데이터 생성
  async createUser(@Body() userData: CreateUserDto) {
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
