'use strict'

const express = require('express')
const router = express.Router()
const login = require('./login')
const profile = require('./profile')

router.post('/login', login.socialLogin) // 소셜로그인 (회원가입)
router.post('/profileWrite', profile.firstwrite) // 프로필 작성
router.post('/profileModify', profile.modify) // 프로필 수정

module.exports = router
