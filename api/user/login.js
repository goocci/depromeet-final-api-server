'use strict'

const User = require("../../models/user")

/**
 * 소셜로그인 (회원가입)
 * @param {*} req
 * @param {*} res
 */
exports.socialLogin = (req, res) => {
  const userId = req.body.user_id
  const snsType = req.body.sns_type

  // TEST
  User
  .create({
    user_id: userId,
    sns_type: snsType,
  })
  .then((results) => {
    res.status(200).json(results)
  })
}