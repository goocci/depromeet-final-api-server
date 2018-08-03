'use strict'

const express = require('express')
const router = express.Router()
const list = require('./list')
const check = require('./check')

router.get('/list', list.getNoticeList) // 나의 알림 목록 조회
router.patch('/check', check.checkNotice) // 알림 확인

module.exports = router
