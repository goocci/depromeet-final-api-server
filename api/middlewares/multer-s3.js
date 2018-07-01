'use strict'

const AWS = require('aws-sdk')
const config = require('../../config')
const multer = require('multer')
const multerS3 = require('multer-s3')

AWS.config.update({
  accessKeyId: config.aws_access_key_id,
  secretAccessKey: config.aws_secret_access_key,
  region: config.aws_region
})

const s3 = new AWS.S3()

const uploadFileToS3 = {
  storage: multerS3({
    s3: s3,
    bucket: 'd4d-bucket',
    acl: 'public-read',
    key: (req, file, cb) => {
      // make unique value with timestamp
      let path = `${file.fieldname}/${Date.now()}_${file.originalname}`
      cb(null, path)
    }
  })
}

const multerS3Mid = multer(uploadFileToS3)

module.exports = multerS3Mid
