<br />
<div align="center" >
  <img width="200px;" src="https://user-images.githubusercontent.com/53927959/154784523-4271ef55-d0f1-4b1c-9cd6-f38d9ca75904.png"/>
</div>

## Nedio

`아마추어 사진 작가들을 위한 온라인 3D 전시회 서비스`

누구나 사진 작가가 될 수 있다.

그러나 전시관은 프로의 전유물이라 대여할 수 없다면?

온라인 공간에서 3D 전시회를 열어보자!
<br/>
<br/>

## 본 프로젝트 소개

```
해당 프로젝트는 3D 갤러리 프로젝트 'Nedio'의 백엔드 프로젝트입니다. 
해당 프로젝트의 목표가 클라이언트 프로젝트에게 데이터를 제공하는 것이기에 코드의 대부분이 API로 이루어져 있습니다. 
```
<br/>

##  데모 링크 🔗

[클릭](http://elice-kdt-sw-1st-team2.elicecoding.com/)하시면 서비스 페이지로 이동합니다.

<br/>

## 프로젝트 사용 기술스택

<img src="https://user-images.githubusercontent.com/53927959/154787933-9ba55ba4-2c86-46dd-b019-550966116fc8.png" width=500px alt="기술스택"/>

<br/>

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
<br/>

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
<br/>

## 서버 구조 및 디자인 패턴에 대한 개략적인 설명
- 요청이 오면 req -> app -> routes -> controllers -> services -> controllers -> res 순으로 처리됩니다.
- login api를 통해 로그인하면 jwt 토큰이 Cookie로 저장되며, jwt 토큰이 필요한 api의 경우 헤더에서 토큰 값을 읽어와 자동으로 인증합니다. 
- 파일 수정, 삭제의 경우 jwt 토큰을 분해하여 해당 아이디가 수정하려는 요소의 생성자 아이디와 같은지 비교하는 로직으로 권한을 확인합니다.

<br/>

## 프로젝트 구현 기능
### 사용자(users) api
1. 로그인 api(jwt 토큰 사용)
2. 사용자 조회, 수정, 삭제 api

### 갤러리(galleries) api
1. 갤러리 조회, 생성, 수정, 삭제 api
2. 갤러리 검색 api(카테고리, 제목, 작성자 조건)
3. 카테고리 별 하나씩 갤러리를 조회하는 api
4. 오픈 예정, 오픈 중인 갤러리를 조회하는 api
5. 자신이 생성한 갤러리를 조회하는 api

### 전시관(halls) api
1. 전시관 조회, 생성, 수정, 삭제 api

### 방명록(comments) api
1. 특정 갤러리의 모든 방명록들(comments)를 조회하는 api
2. 방명록 생성, 수정, 삭제 api

### 이미지 업로드 api
1. 요청으로 formData를 받아 AWS S3에 업로드하는 api

#### 좀 더 자세한 api 설명(요청, 응답 예시)는 밑의 api 문서 칸에서 확인하실 수 있습니다.

<br/>

## api 문서

### Notion
https://www.notion.so/elice/6a4b5dac8aec4297a270d2292a3719f9

### POSTMAN Docs
https://documenter.getpostman.com/view/18610955/UVkjvdDh

<br/>

## 팀원 👨‍👨‍👧‍👧

|                                         Backend                                          |                                         Frontend                                           |                                         Frontend                                           |                                         Frontend                                          |                                         Frontend                                        
| :--------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: | 
| <img src="https://avatars.githubusercontent.com/u/75158857?v=4" width=400px alt="김동근"/> | <img src="https://avatars.githubusercontent.com/u/87048955?v=4" width=400px alt="김도영"/> | <img src="https://avatars.githubusercontent.com/u/53927959?v=4" width=400px alt="손지성"/> | <img src="https://avatars.githubusercontent.com/u/57756798?v=4" width=400px alt="이창혁"> | <img src="https://avatars.githubusercontent.com/u/68373235?v=4" width=400px alt="이동훈"> |
|                       [김동근](https://github.com/Kimdonggeun-42)                        |                            [김도영](https://github.com/sinnlos-ffff)                             |                            [손지성](https://github.com/Danji-ya)                            |                          [이창혁](https://github.com/rheech22)                           |                         [이동훈](https://github.com/dongjay00) 
<br/>

## 작성자
김동근(kimdg0429@naver.com, https://github.com/Kimdonggeun-42)
