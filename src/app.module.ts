import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'; // 몽구스모듈 import
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { HallModule } from './hall/hall.module';
import { GalleryModule } from './gallery/gallery.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    HallModule,
    GalleryModule,
    CommentModule, // UserController, UserService는 user.moudle.ts에 이미 등록되어있으므로 밑에 등록 안해도 됨(하면 오류발생)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
