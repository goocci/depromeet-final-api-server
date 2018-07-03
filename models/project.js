'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Project = new Schema({
  userId: String, // 사용자 고유 id(=작성자)
  title: String, // 제목
  text: String, // 본문
  startDt: Date, // 프로젝트 시작일시
  endDt: Date, // 프로젝트 끝일시
  skillCode: { // 필요 기술코드 목록
    designer: [String], // 디자이너 기술코드 목록
    developer: [String] // 개발자 기술코드 목록
  },
  attachments: [{ // 첨부파일 목록
    fileName: String, // 파일명
    s3Location: String, // AWS S3 경로
    size: Number // 파일 사이즈
  }],
  hits: {type: Number, default: 0}, // 조회수
  applicant: [{ // 지원자 목록
    userId: String, // 지원자 고유 id
    join: Boolean, // 참여 여부
  }],
  createdDt: {type: Date, default: Date.now}, // 생성 일시
  updatedDt: {type: Date, default: Date.now}, // 수정 일시
  comments: [{
    commenterId: String, // User 아이디
    contents: String, // 내용
    date: {type: Date, default: Date.now} // 일자
  }]
},
{collection: 'project'}
)

module.exports = mongoose.model('Project', Project)
