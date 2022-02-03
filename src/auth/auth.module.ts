import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5h' }, // jwt토큰 만료는 1시간. 토큰만료가 적용되는지 확인완료됨
    }),
  ],
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
