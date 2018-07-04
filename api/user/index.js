'use strict'

const express = require('express')
const router = express.Router()
const login = require('./login')
const profile = require('./profile')

router.post('/login', login.socialLogin) // 소셜로그인 (회원가입)
router.post('/profileWrite', profile.firstwrite)
router.post('/profileModify', profile.modify)

module.exports = router
