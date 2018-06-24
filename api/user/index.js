'use strict'

const express = require('express')
const router = express.Router()
const login = require('./login')

router.post('/login', login.socialLogin) // 소셜로그인 (회원가입)

module.exports = router
