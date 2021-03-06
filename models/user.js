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
  skillCode: { // 보유 기술코드 목록
    design: [{ // 디자인 기술코드 목록
      code: String, // 코드
      score: Number // 숙련도
    }],
    frontend: [{ // 프론트엔드 기술코드 목록
      code: String, // 코드
      score: Number // 숙련도
    }],
    backend: [{ // 백엔드 기술코드 목록
      code: String, // 코드
      score: Number // 숙련도
    }]
  },
  projectNum: Number, // 프로젝트 진행 수
  position: String, // 포지션
  area: String, // 지역
  contact: String // 연락처
},
{collection: 'user'}
)

module.exports = mongoose.model('User', User)
