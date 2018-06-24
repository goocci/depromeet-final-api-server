'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Project = new Schema({
  title: String, // 제목
  text: String, // 본문
  // [TODO] 추가 프로젝트 정보...
  created_dt: {type: Date, default: Date.now}, // 생성 일시
  updated_dt: {type: Date, default: Date.now}, // 수정 일시
},
{collection: 'project'}
)

module.exports = mongoose.model('Project', Project)
