// utils/s3.js
const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  // Important: Set the correct S3 endpoint configuration
  s3ForcePathStyle: true, // Needed for DigitalOcean Spaces compatibility
});

const uploadToS3 = (filename, fileStream) => {
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    Body: fileStream,
    ACL: "public-read", // Or use pre-signed URLs for better security
  };

  return s3.upload(uploadParams).promise();
};

module.exports = {
  uploadToS3,
};
