import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import 'dotenv/config';

// AWS S3
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class UploadImageService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async uploadImage(@Req() req, @Res() res) {
    try {
      this.upload(req, res, function (err) {
        if (err) {
          console.log(err);
          return res
            .status(404)
            .json({ success: false, message: 'failed upload img' });
        }
        return res.status(201).json({
          success: true,
          message: 'upload success',
          url: req.files[0].location,
        });
      });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ success: false, message: 'failed upload img' });
    }
  }

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: function (req, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
  }).array('upload', 1);
}
