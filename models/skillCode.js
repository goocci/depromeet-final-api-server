'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SkillCode = new Schema({
  codeType: String, // 기술코드 구분 ("designer" or "developer")
  items: [{
    code: String, // 기술코드 (Ex. "DESIGNER_SKILL_CODE_1" or "DEVELOPER_SKILL_CODE_1")
    codeName: String, // 기술코드명 (Ex. "스케치" or "안드로이드")
  }]
},
{collection: 'skillCode'}
)

module.exports = mongoose.model('SkillCode', SkillCode)
