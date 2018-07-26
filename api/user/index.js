'use strict'

const express = require('express')
const router = express.Router()
const login = require('./login')
const profile = require('./profile')
const multerS3 = require('../middlewares/multer-s3-image') // 파일 업로드

router.post('/login', login.socialLogin) // 소셜로그인 (회원가입)
router.post('/profileWrite', multerS3.single('images'), profile.write) // 프로필 작성
router.get('/myProfile', profile.getMyProfile) // 나의 프로필 조회
router.get('/myProfile/tooltip', profile.getMyProfileTooltip) // 나의 프로필 Tooltip 조회

module.exports = router
