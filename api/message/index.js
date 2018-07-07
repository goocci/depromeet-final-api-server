'use strict'

const express = require('express')
const router = express.Router()
const send = require('./send')
const inbox = require('./inbox')

router.post('/send', send.sendMessage) // 쪽지 보내기
router.get('/list/inbox', inbox.getMyInboxList) // 나의 받은쪽지함 목록 조회

module.exports = router
