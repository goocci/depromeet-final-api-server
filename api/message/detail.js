'use strict'

const User = require('../../models/user')
const Message = require('../../models/message')
const moment = require('moment')

/**
 * [API] 쪽지 상세 정보 조회
 * @param {*} req
 * @param {*} res
 */
exports.getMessageDetail = (req, res) => {
  const messageId = req.query.messageId

  // 0. 쿼리스트링 확인
  const checkQueryString = () => {
    return new Promise((resolve, reject) => {
      if (!messageId) {
        return reject({
          code: 'query_string_error',
          message: 'query string is not defined'
        })
      } else resolve()
    })
  }

  // 1. 쪽지 정보 조회 및 읽음 여부 수정
  const getMsgInfoAndIsReadUpdate = () => {
    return Message
          .findOneAndUpdate({
            _id: messageId
          }, {
            $set: {
              isRead: true
            }
          }, {
            new: true
          })
  }

  // 2. 응답 정보 셋팅
  const setResponse = (msgInfo) => {
    return new Promise((resolve, reject) => {
      User
      .findOne({
        userId: msgInfo.senderId
      })
      .then((senderInfo) => {
        res.status(200).json({
          receiveDate: moment(msgInfo.createdDt).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
          senderNickName: senderInfo.nickName,
          senderId: senderInfo.userId,
          title: msgInfo.title,
          content: msgInfo.content
        })
      })
      .catch((err) => {
        return reject(err)
      })
    })
  }

  checkQueryString()
  .then(getMsgInfoAndIsReadUpdate)
  .then(setResponse)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}