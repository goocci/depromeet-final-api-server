'use strict'

const express = require('express')
const router = express.Router()
const send = require('./send')

router.post('/send', send.sendMessage) // 쪽지 보내기

module.exports = router
