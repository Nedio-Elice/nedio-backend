import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { GalleryModule } from './gallery/gallery.module';
import { CommentModule } from './comment/comment.module';
import { AuthModule } from './auth/auth.module';
import { UploadImageModule } from './upload-image/upload-image.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    GalleryModule,
    CommentModule,
    AuthModule,
    UploadImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
