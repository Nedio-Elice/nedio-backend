## 프로젝트 소개

해당 프로젝트는 3D 갤러리 프로젝트 'Nedio'의 백엔드 프로젝트입니다. 
해당 프로젝트의 목표가 클라이언트 프로젝트에게 데이터를 제공하는 것이기에 코드의 대부분이 API로 이루어져 있습니다. 

## 프로젝트 사용 기술스택

해당 프로젝트는 Typescript, Node JS, Nest JS, Mongo DB, AWS S3를 사용합니다.

## 프로젝트 구조
```
📦src
 ┣ 📂auth
 ┃ ┣ 📜auth.module.ts
 ┃ ┣ 📜auth.service.ts
 ┃ ┣ 📜constants.ts
 ┃ ┣ 📜jwt-auth.guard.ts
 ┃ ┣ 📜jwt.strategy.ts
 ┃ ┣ 📜local-auth.guard.ts
 ┃ ┗ 📜local.strategy.ts
 ┣ 📂comment
 ┃ ┣ 📂dto
 ┃ ┃ ┣ 📜create-comment.dto.ts
 ┃ ┃ ┗ 📜update-comment.dto.ts
 ┃ ┣ 📂schema
 ┃ ┃ ┗ 📜comment.schema.ts
 ┃ ┣ 📜comment.controller.ts
 ┃ ┣ 📜comment.module.ts
 ┃ ┗ 📜comment.service.ts
 ┣ 📂gallery
 ┃ ┣ 📂dto
 ┃ ┃ ┣ 📜create-gallery.dto.ts
 ┃ ┃ ┗ 📜update-gallery.dto.ts
 ┃ ┣ 📂schema
 ┃ ┃ ┗ 📜gallery.schema.ts
 ┃ ┣ 📜gallery.controller.ts
 ┃ ┣ 📜gallery.module.ts
 ┃ ┗ 📜gallery.service.ts
 ┣ 📂hall
 ┃ ┣ 📂dto
 ┃ ┃ ┣ 📜create-hall.dto.ts
 ┃ ┃ ┗ 📜update-hall.dto.ts
 ┃ ┣ 📂schema
 ┃ ┃ ┗ 📜hall.schema.ts
 ┃ ┣ 📜hall.controller.ts
 ┃ ┣ 📜hall.module.ts
 ┃ ┗ 📜hall.service.ts
 ┣ 📂upload-image
 ┃ ┣ 📜upload-image.controller.ts
 ┃ ┣ 📜upload-image.module.ts
 ┃ ┗ 📜upload-image.service.ts
 ┣ 📂user
 ┃ ┣ 📂dto
 ┃ ┃ ┣ 📜create-user.dto.ts
 ┃ ┃ ┗ 📜update-user.dto.ts
 ┃ ┣ 📂schema
 ┃ ┃ ┗ 📜user.schema.ts
 ┃ ┣ 📜user.controller.ts
 ┃ ┣ 📜user.module.ts
 ┃ ┗ 📜user.service.ts
 ┣ 📜app.controller.ts
 ┣ 📜app.module.ts
 ┣ 📜app.service.ts
 ┗ 📜main.ts
```

## 프로젝트 사용법(컴파일, 실행방법)

```bash
# 프로젝트 필요 패키지 설치
$ npm install
```

```bash
# .env 파일 내용
MONGO_URL = 'mongodb+srv://<id>:<pw>@cluster0.tgtl1.mongodb.net/<DB name>?retryWrites=true&w=majority'
AWS_S3_BUCKET_NAME='AWS 버킷 이름'
AWS_ACCESS_KEY_ID='각자의 AWS_ACCESS_KEY_ID'
AWS_SECRET_ACCESS_KEY='각자의 AWS_SECRET_ACCESS_KEY'
AWS_REGION='각자의 AWS_REGION'
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 프로젝트 기능 설명

## api 문서
### Notion
https://www.notion.so/elice/6a4b5dac8aec4297a270d2292a3719f9

### POSTMAN Docs
https://documenter.getpostman.com/view/18610955/UVkjvdDh

## 작성자
김동근(kimdg0429@naver.com, https://github.com/Kimdonggeun-42)
