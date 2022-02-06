import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true })
  email: string; // 이메일

  @Prop({ required: true })
  nickname: string; // 닉네임

  @Prop()
  profileURL: string; // 프로필 사진 경로

  @Prop()
  contact: string; // 연락처(폰번호, 디폴트 "")

  @Prop()
  introduce: string; // 자기소개(디폴트 "")
}

export const UserSchema = SchemaFactory.createForClass(User);
