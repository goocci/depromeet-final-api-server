'use strict'

const express = require('express')
const router = express.Router()
const login = require('./login')
const profile = require('./profile')

router.post('/login', login.socialLogin) // 소셜로그인 (회원가입)
router.post('/profileWrite', profile.write) // 프로필 작성

module.exports = router
