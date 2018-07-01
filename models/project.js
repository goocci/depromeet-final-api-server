'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Project = new Schema({
  title: String, // 제목
  text: String, // 본문
  skillCode: { // 필요 기술코드 목록
    designer: [String], // 디자인
    developer: [String] // 개발자
  },
  attachments: { // 첨부파일
    fileName: String, // 파일명
    s3Path: String, // AWS S3 경로
    sise: Number // 파일 사이즈
  },
  created_dt: {type: Date, default: Date.now}, // 생성 일시
  updated_dt: {type: Date, default: Date.now}, // 수정 일시
},
{collection: 'project'}
)

module.exports = mongoose.model('Project', Project)
