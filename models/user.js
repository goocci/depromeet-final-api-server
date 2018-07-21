'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  userId: String, // 사용자 고유 id
  email: String, // 이메일
  snsType: String, // 소셜로그인 종류
  realName: {type: String, default: ''}, // 실명
  nickName: String, // 닉네임
  profileImage: { // 프로필 이미지
    original: { // 원본 이미지
      fileName: String, // 파일명
      s3Location: String, // AWS S3 경로
      size: Number // 파일 사이즈
    },
    resized: { // 리사이즈된 이미지
      fileName: String, // 파일명
      s3Location: String, // AWS S3 경로
      size: Number // 파일 사이즈
    }
  },
  createdDt: {type: Date, default: Date.now}, // 생성 일시
  updatedDt: {type: Date, default: Date.now}, // 수정 일시
  introduction: String, // 자기 소개
  skillCode: { // 보유 기술코드 목록
    designer: [String], // 디자이너 기술코드 목록
    developer: [String] // 개발자 기술코드 목록
  },
  projectNum: String,
  region: String
},
{collection: 'user'}
)

module.exports = mongoose.model('User', User)
