import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prefix = '/api'; // 앞으로의 요청은 서버/api 순으로 들어오게됨. 문제 생기면 13,14줄 지울것
  app.setGlobalPrefix(prefix);
  // CORS 에러 방지
  app.enableCors({
    methods: 'POST,GET,PUT,PATCH,DELETE,OPTIONS',
    credentials: true,
    origin: 'http://elice-kdt-sw-1st-team2.elicecoding.com',
  });
  // 백엔드 전역에서 유효성 검사가 이루어지도록 전역 범위 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // validation을 위한 decorator가 붙어있지 않은 속성들은 제거
      forbidNonWhitelisted: true, // whitelist 설정을 켜서 걸러질 속성이 있다면 아예 요청 자체를 막도록 (400 에러)
      transform: true, // 요청에서 넘어온 자료들의 형변환
    }),
  );

  app.use(morgan('dev'));
  app.use(cookieParser());

  await app.listen(4000); // 백엔드는 5000번 포트 사용
}
bootstrap();
