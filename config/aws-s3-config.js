const aws = require("aws-sdk");

const SECRET_ACCESS_KEY = "eNKSgilQnv56h/KF/+D/qIQerMf8+gZNtkXCbWnw";
const ACCESS_KEY_ID = "AKIAIZIJBUF6BINQEVZQ";
const BUCKET_NAME = "pc-notes";
const REGION = "us-east-1";

aws.config.update({
  secretAccessKey: SECRET_ACCESS_KEY,
  accessKeyId: ACCESS_KEY_ID,
  region: REGION,
  signatureVersion: 'v4',
});

const s3 = new aws.S3();

module.exports = s3;