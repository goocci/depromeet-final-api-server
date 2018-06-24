'use strict'

const express = require('express')
const router = express.Router()
const user = require('./user')

router.use('/user', user) // 사용자 관련

module.exports = router
