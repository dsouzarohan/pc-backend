const Zipper = require("aws-s3-zipper");

const SECRET_ACCESS_KEY = "eNKSgilQnv56h/KF/+D/qIQerMf8+gZNtkXCbWnw";
const ACCESS_KEY_ID = "AKIAIZIJBUF6BINQEVZQ";
const BUCKET_NAME = "pc-notes";
const REGION = "us-east-1";

const config = {
  secretAccessKey: SECRET_ACCESS_KEY,
  accessKeyId: ACCESS_KEY_ID,
  region: REGION,
  bucket: BUCKET_NAME
};

const zipper = new Zipper(config);
zipper.init(config);

module.exports = zipper;
