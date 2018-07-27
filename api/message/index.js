'use strict'

const express = require('express')
const router = express.Router()
const send = require('./send')
const receivedList = require('./received-list')
const sentList = require('./sent-list')
const detail = require('./detail')

router.post('/send', send.sendMessage) // 쪽지 보내기
router.get('/list/received', receivedList.getMyReceivedMsgList) // 나의 받은쪽지함 목록 조회
router.get('/list/sent', sentList.getMySentMsgList) // 나의 보낸쪽지함 목록 조회
router.get('/detail', detail.getMessageDetail) // 쪽지 상세 정보 조회

module.exports = router
