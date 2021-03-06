'use strict'

const express = require('express')
const router = express.Router()
const user = require('./user')
const project = require('./project')
const message = require('./message')
const notice = require('./notice')
const skillCode = require('./skill-code')

router.use('/user', user) // 사용자 관련
router.use('/project', project) // 프로젝트 관련
router.use('/message', message) // 프로젝트 관련
router.use('/notice', notice) // 알림 관련
router.use('/skill-code', skillCode) // 기술코드 관련

module.exports = router
