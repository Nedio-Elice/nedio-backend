import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
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
      const newEmail = email;
      const newNickname = nickname;
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

      return newResult;
    }
    return result;
  }
}
