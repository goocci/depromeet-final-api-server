'use strict'

const Notice = require('../../models/notice')

/**
 * [API] 알림 확인
 * @param {*} req
 * @param {*} res
 */
exports.checkNotice = (req, res) => {
  const noticeId = req.body.noticeId

  // 0. 요청 바디 확인
  const checkReqBody = () => {
    return new Promise((resolve, reject) => {
      if (!noticeId) {
        return reject({
          code: 'request_body_error',
          message: 'request body is not defined'
        })
      } else resolve()
    })
  }

  // 1. 알림 확인
  const check = () => {
    return Notice
          .findOneAndUpdate({
            _id: noticeId
          }, {
            $set: {
              isCheck: true,
              updatedDt: new Date()
            }
          })
  }

  // 2. 응답
  const resp = () => {
    res.status(200).json({
      code: 'suc_check_notice',
      message: '알림 확인 성공'
    })
  }

  checkReqBody()
  .then(check)
  .then(resp)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}
