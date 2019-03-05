const aws = require("aws-sdk");

const SECRET_ACCESS_KEY = "somesecretkey";
const ACCESS_KEY_ID = "anothersecret";
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