const S3 = require("../config/aws-s3-config");
const { BUCKET_NAME } = require("../config/multer-config");

const getS3ObjectsAsBufferArray = files => {
  return new Promise((resolve, reject) => {
    let objectBufferArray = [];

    files.forEach(file => {
      let params = {
        Bucket: BUCKET_NAME,
        Key: file.key
      };

      S3.getObject(params, (err, data) => {
        if (err) {
          reject({
            message: "Could not find files: " + err.toString()
          });
        } else {
          console.log("Fetched and pushing buffer");

          objectBufferArray.push({
            buffer: data.Body,
            originalName: file.originalName
          });
          if (objectBufferArray.length === files.length) {
            console.log("Number of buffers required have been pushed");

            resolve({
              message: "File buffers fetched",
              bufferArray: objectBufferArray
            });
          }
        }
      });
    });
  });
};

module.exports = {
  getS3ObjectsAsBufferArray
};
