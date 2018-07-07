'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = new Schema({
  senderId: String, // 보낸이 고유 id
  receiverId: String, // 받는이 고유 id
  title: String, // 제목
  content: String, // 내용
  isRead: {type: Boolean, default: false},
  createdDt: {type: Date, default: Date.now}, // 생성 일시
  updatedDt: {type: Date, default: Date.now}, // 수정 일시
},
{collection: 'message'}
)

module.exports = mongoose.model('Message', Message)
