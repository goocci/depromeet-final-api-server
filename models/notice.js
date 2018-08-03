'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Notice = new Schema({
  userId: String, // 알림 대상의 고유 id
  isCheck: {type: Boolean, default: false}, // 확인 여부
  type: String, // 알림 종류 ("message" or "selected" or "apply")
  contents: { // 내용물
    text: String, // 알림 내용
    // ("님이 귀하에게 쪽지를 보냈습니다.") --> "message"
    // ("프로젝트 참여자에 선정되셨습니다!") --> "selected"
    // ("님이 귀하의 프로젝트에 지원했습니다.") --> "apply"
    senderId: String, // 보낸이 고유 id --> "message"
    messageId: String, // 쪽지 고유 id --> "message"
    projectId: String, // 프로젝트 고유 id --> "selected" or "apply"
    applicantId: String // 지원자 고유 id --> "apply"
  },
  createdDt: {type: Date, default: Date.now}, // 생성 일시
  updatedDt: {type: Date, default: Date.now} // 수정 일시
},
{collection: 'notice'}
)

module.exports = mongoose.model('Notice', Notice)
