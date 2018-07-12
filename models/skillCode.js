'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SkillCode = new Schema({
  codeType: String, // 기술코드 구분 ("design" or "frontend" or "backend")
  items: [{
    code: String, // 기술코드 (Ex. "DESIGN_SKILL_CODE_1" or "FRONTEND_SKILL_CODE_1" or ""BACKEND_SKILL_CODE_1"")
    codeName: String, // 기술코드명 (Ex. "스케치" or "안드로이드")
    image: String // 기술 로고이미지 URL
  }]
},
{collection: 'skillCode'}
)

module.exports = mongoose.model('SkillCode', SkillCode)
