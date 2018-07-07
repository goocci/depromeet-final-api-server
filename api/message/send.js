'use strict'

const User = require('../../models/user')
const Message = require('../../models/message')

/**
 * [API] 쪽지 보내기
 * @param {*} req
 * @param {*} res
 */
exports.sendMessage = (req, res) => {
  const senderId = req.body.senderId
  const receiverId = req.body.receiverId
  const content = req.body.content

  // 0. 요청 바디 확인
  const checkReqBody = () => {
    return new Promise((resolve, reject) => {
      if (!senderId || !receiverId) {
        return reject({
          code: 'request_body_error',
          message: 'request body is not defined'
        })
      } else resolve()
    })
  }

  // 1. 쪽지 저장
  const saveMessage = () => {
    return Message
          .create({
            senderId: senderId,
            receiverId: receiverId,
            content: content
          })
  }

  // 2. 응답
  const resp = () => {
    res.status(200).json({
      code: 'suc_send_message',
      message: '쪽지 전송 성공'
    })
  }

  checkReqBody()
  .then(saveMessage)
  .then(resp)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}