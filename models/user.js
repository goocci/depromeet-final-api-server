'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  user_id: String, // 사용자 고유 id
  sns_type: String, // 회원가입 종류
  realname: String, // 실명
  nickname: String, // 닉네임
  profile_image: { // 프로필 이미지
    original: { // 원본 이미지
      file_name: String, // 파일명
      s3_path: String, // AWS S3 경로
      size: Number // 파일 사이즈
    },
    resized: { // 리사이즈된 이미지
      file_name: String, // 파일명
      s3_path: String, // AWS S3 경로
      size: Number // 파일 사이즈
    }
  },
  // [TODO] 추가 프로필 및 사용자 정보...
  created_dt: {type: Date, default: Date.now}, // 생성 일시
  updated_dt: {type: Date, default: Date.now}, // 수정 일시
},
{collection: 'user'}
)

module.exports = mongoose.model('User', User)
