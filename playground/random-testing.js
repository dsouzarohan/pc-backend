const mime = require("mime-types");
const fs = require("fs");
const S3 = require("../config/aws-s3-config");

let params = {
  Bucket: "pc-notes",
  Key: "pc-classroom#4/pc-upload#4cebecee-31e9-4a68-9252-7728417495b5/1551466638994$revelationfinal.docx"
};

S3.getObject(params, (err, data) => {
  if (err) console.log(err, err.stack);
  // an error occurred
  else console.log(data);
});
