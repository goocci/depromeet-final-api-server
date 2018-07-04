'use strict'

const User = require('../../models/user')

/**
 * 소셜로그인 (회원가입)
 * @param {*} req
 * @param {*} res
 */
exports.socialLogin = (req, res) => {
  const userId = req.body.userId
  const email = req.body.email
  const snsType = req.body.snsType
  const nickName = req.body.nickName

  // 0. 요청 바디 확인
  const checkReqBody = () => {
    return new Promise((resolve, reject) => {
      if (!userId || !email || !snsType || !nickName) {
        return reject({
          code: 'request_body_error',
          message: 'request body is not defined'
        })
      } else resolve()
    })
  }

  // 1. 사용자 정보 조회
  const getUserInfo = () => {
    return User.findOne({ userId: userId })
  }

  // 2. 회원가입 or 로그인
  // 사용자 정보가 있다면 --> 회원정보 응답
  // 사용자 정보가 없다면 --> 회원정보 저장 후 응답
  const signUpOrSignIn = (userInfo) => {
    if (userInfo) return Promise.resolve(userInfo)
    else return User.create({ userId: userId, email: email, snsType: snsType, nickName: nickName })
  }

  // 3. 사용자 정보 응답
  const respUserInfo = (userInfo) => {
    res.status(200).json({
      userId: userInfo.userId,
      email: userInfo.email,
      nickName: userInfo.nickName,
      realName: userInfo.realName,
      snsType: userInfo.snsType,
      profileImage: userInfo.profileImage.resized.s3Location ? userInfo.profileImage.resized.s3Location : 'https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png',
    })
  }

  checkReqBody()
  .then(getUserInfo)
  .then(signUpOrSignIn)
  .then(respUserInfo)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}
