'use strict'

const Message = require('../../models/message')
const Notice = require('../../models/notice')

/**
 * [API] 쪽지 보내기
 * @param {*} req
 * @param {*} res
 */
exports.sendMessage = (req, res) => {
  const senderId = req.body.senderId
  const receiverId = req.body.receiverId
  const title = req.body.title
  const content = req.body.content

  // 0. 요청 바디 확인
  const checkReqBody = () => {
    return new Promise((resolve, reject) => {
      if (!senderId || !receiverId || !title || !content) {
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
            title: title,
            content: content
          })
  }

  // 2. 받는이 알림 생성
  const createReceiverNotice = (msgInfo) => {
    return Notice
          .create({
            userId: receiverId,
            type: 'message',
            contents: {
              text: '님이 귀하에게 쪽지를 보냈습니다.',
              senderId: senderId,
              messageId: msgInfo._id
            }
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
  .then(createReceiverNotice)
  .then(resp)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}