'use strict'

const User = require('../../models/user')
const Message = require('../../models/message')
const moment = require('moment')

/**
 * [API] 보낸쪽지함 목록 조회
 * @param {*} req
 * @param {*} res
 */
exports.getMySentMsgList = (req, res) => {
  const userId = req.query.userId
  const page = req.query.page || 1
  const perPage = req.query.perPage || 10

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

  // 1. 나의 보낸쪽지함 목록 조회
  const getMessageList = () => {
    return new Promise((resolve, reject) => {
      Message
      .find({
        senderId: userId
      })
      .sort('-createdDt')
      .paginate({
        perPage: perPage,
        delta  : 3,
        page   : page
      }, (err, results) => {
        if (err) return reject(err)
  
        const messageArr = results.results.map((message) => {
          return getReceiverInfo(message)
        })

        Promise.all(messageArr)
        .then((resp) => {
          res.status(200).json({
            messageList: resp,
            currentPage: results.current,
            lastPage: results.last,
            totalCount: results.count
          })
        })
      })
    })
  }

  // [Func] 받는이 정보 조회
  const getReceiverInfo = (message) => {
    return new Promise((resolve, reject) => {
      User
      .findOne({
        userId: message.receiverId
      })
      .then((receiverInfo) => {
        resolve({
          messageId: message._id,
          content: message.content.substring(0, 10),
          title: message.title,
          sentDate: moment(message.createdDt).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
          receiverisRead: message.isRead,
          receiverNickName: receiverInfo.nickName,
          receiverId: receiverInfo.userId
        })
      })
      .catch((err) => {
        return reject(err)
      })
    })
  }

  checkQueryString()
  .then(getMessageList)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}