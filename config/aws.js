'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  AWS_ACCESS_KEY_ID: joi.string()
    .required(),
  AWS_SECRET_ACCESS_KEY: joi.string()
    .required()
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  // AWS
  aws_access_key_id: envVars.AWS_ACCESS_KEY_ID,
  aws_secret_access_key: envVars.AWS_SECRET_ACCESS_KEY,
  aws_region: 'ap-northeast-2',
  aws_s3_bucket: 'd4d-bucket'
}

module.exports = config
