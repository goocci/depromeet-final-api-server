'use strict'

const express = require('express')
const router = express.Router()
const list = require('./list')

router.get('/list', list.getSkillCodeList) // 기술코드 목록 조회

module.exports = router
