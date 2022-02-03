import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'profileURL',
    });
  }

  async validate(
    email: string,
    profileURL: string,
    nickname: string,
  ): Promise<any> {
    const result = await this.authService.validateUser(email);
    if (result.result == 'Idfailed') {
      // 아이디가 존재하지 않아 새로운 회원정보를 생성
      const newEmail = email; // 현재 oauth에서 어떤 형식으로 받아오는지를 몰라 email을 받는다고 가정하고 작성했습니다.
      const newNickname = nickname; // 빈칸으로 설정시 에러 발생
      const newProfileURL = profileURL;
      const newContact = '연락처를 설정해주세요.';
      const newIntroduce = '자기소개를 정해주세요.';
      const newUser = {
        email: newEmail,
        nickname: newNickname,
        profileURL: newProfileURL,
        contact: newContact,
        introduce: newIntroduce,
      };
      await this.userService.createUser({ ...newUser, user: newUser });
      const newResult = await this.authService.validateUser(email);

      // 새로운 회원의 정보를 다시 validate 시켜 userController에서 result를 req에 할당 후, 해당 정보로 토큰을 발급받게함
      return newResult;
    }
    return result;
  }
}
