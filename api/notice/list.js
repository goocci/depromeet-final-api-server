'use strict'

const User = require('../../models/user')
const Notice = require('../../models/notice')

/**
 * [API] 나의 알림 목록 조회
 * @param {*} req
 * @param {*} res
 */
exports.getNoticeList = (req, res) => {
  const userId = req.query.userId

  // 0. 쿼리스트링 확인
  const checkQueryString = () => {
    return new Promise((resolve, reject) => {
      if (!userId) {
        return reject({
          code: 'query_string_error',
          message: 'query string is not defined'
        })
      } else resolve()
    })
  }

  // 1. 알림 목록 조회
  const getMyNoticeList = () => {
    return Notice.find({ userId: userId, isCheck: false }).sort('-createdDt')
  }

  // 2. 알림 종류별 내용 셋팅
  const setMyNoticeList = (noticeList) => {
    const setMany = noticeList.map((notice) => {
      if (notice.type === 'message') return setMessageNotice(notice)
      else if (notice.type === 'selected') return setSelectedNotice(notice)
      else if (notice.type === 'apply') return setApplyNotice(notice)
    })

    return Promise.all(setMany)
  }

  // 3. 응답
  const resp = (results) => {
    res.status(200).json(results)
  }

  checkQueryString()
  .then(getMyNoticeList)
  .then(setMyNoticeList)
  .then(resp)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}

// [Func] Message 알림 셋팅
const setMessageNotice = (noticeInfo) => {
  return new Promise((resolve, reject) => {
    User
    .findOne({
      userId: noticeInfo.contents.senderId
    })
    .then((senderInfo) => {
      resolve({
        noticeId: noticeInfo._id,
        content: `${senderInfo.nickName}${noticeInfo.contents.text}`,
        type: noticeInfo.type,
        messageId: noticeInfo.contents.messageId
      })
    })
    .catch((err) => {
      return reject(err)
    })
  })
}

// [Func] Selected 알림 셋팅
const setSelectedNotice = (noticeInfo) => {
  return new Promise((resolve, reject) => {
    resolve({
      noticeId: noticeInfo._id,
      content: noticeInfo.contents.text,
      type: noticeInfo.type,
      projectId: noticeInfo.contents.projectId
    })
  })
}

// [Func] Apply 알림 셋팅
const setApplyNotice = (noticeInfo) => {
  return new Promise((resolve, reject) => {
    User
    .findOne({
      userId: noticeInfo.contents.applicantId
    })
    .then((applicantInfo) => {
      resolve({
        noticeId: noticeInfo._id,
        content: `${applicantInfo.nickName}${noticeInfo.contents.text}`,
        type: noticeInfo.type,
        projectId: noticeInfo.contents.projectId
      })
    })
    .catch((err) => {
      return reject(err)
    })
  })
}