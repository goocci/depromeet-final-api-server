'use strict'

const express = require('express')
const router = express.Router()
const create = require('./create')
const lookup = require('./lookup')
const apply = require('./apply')
const comment = require('./comment')
const multerS3 = require('../middlewares/multer-s3') // 파일 업로드

router.post('/lookupAll', lookup.lookupAllProject) // 전체 프로젝트 조회
router.post('/lookupDetail', lookup.lookupDetail) // 프로젝트 상세 정보 조회
router.post('/', multerS3.array('attachments', 3), create.createProject) // 프로젝트 생성
router.post('/addComment', comment.AddComment)
router.post('/deleteComment', comment.DeleteComment)
router.post('/apply', apply.apply)
router.post('/applyCancel', apply.applyCancel)

module.exports = router
