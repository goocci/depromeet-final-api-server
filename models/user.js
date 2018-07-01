'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  userId: String, // 사용자 고유 id
  snsType: String, // 소셜로그인 종류
  realName: {type: String, default: ''}, // 실명
  nickName: String, // 닉네임
  profileImage: { // 프로필 이미지
    original: { // 원본 이미지
      fileName: String, // 파일명
      s3Path: String, // AWS S3 경로
      size: Number // 파일 사이즈
    },
    resized: { // 리사이즈된 이미지
      fileName: String, // 파일명
      s3Path: String, // AWS S3 경로
      size: Number // 파일 사이즈
    }
  },
  createdDt: {type: Date, default: Date.now}, // 생성 일시
  updatedDt: {type: Date, default: Date.now}, // 수정 일시
},
{collection: 'user'}
)

module.exports = mongoose.model('User', User)
