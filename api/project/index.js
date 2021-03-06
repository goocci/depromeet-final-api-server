'use strict'

const express = require('express')
const router = express.Router()
const create = require('./create')
const lookup = require('./lookup')
const apply = require('./apply')
const comment = require('./comment')
const list = require('./list')
const applicant = require('./applicant')
const participant = require('./participant')
const multerS3 = require('../middlewares/multer-s3') // 파일 업로드

router.post('/lookupAll', lookup.lookupAllProject) // 전체 프로젝트 조회
router.get('/list/main', list.getMainProjectList) // 메인 프로젝트 목록 조회
router.get('/list/my', list.getMyProjectList) // 나의 프로젝트 목록 조회
router.post('/lookupDetail', lookup.lookupDetail) // 프로젝트 상세 정보 조회
router.post('/', multerS3.array('attachments', 3), create.createProject) // 프로젝트 생성
router.post('/comments', comment.Comments) // 댓글 조회
router.post('/addComment', comment.AddComment) // 댓글 추가
router.post('/deleteComment', comment.DeleteComment) // 댓글 삭제
router.post('/apply', apply.apply) // 프로젝트 지원
router.post('/applyCancel', apply.applyCancel) // 지원 취소
router.post('/applyAccept', apply.applyAccept) // 지원 허가

router.get('/applicant/list', applicant.getApplicantList) // 지원자 목록 조회
router.get('/participant/list', participant.getParticipantList) // 참여자 목록 조회

module.exports = router
