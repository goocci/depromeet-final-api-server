'use strict'

const express = require('express')
const router = express.Router()
const list = require('./list')

router.get('/list', list.getNoticeList) // 나의 알림 목록 조회
// [TODO] 알림 확인 API

module.exports = router
