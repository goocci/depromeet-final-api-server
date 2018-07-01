'use strict'

const express = require('express')
const router = express.Router()
const create = require('./create')

router.post('/', create.createProject) // 프로젝트 생성

module.exports = router
