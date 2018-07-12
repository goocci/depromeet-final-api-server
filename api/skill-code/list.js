'use strict'

const SkillCode = require("../../models/skillCode")

/**
 * 기술코드 목록 조회
 * @param {*} req
 * @param {*} res
 */
exports.getSkillCodeList = (req, res) => {
  const type = req.query.type

  // 0. 쿼리스트링 확인
  const checkQueryString = () => {
    return new Promise((resolve, reject) => {
      if (!type) {
        return reject({
          code: 'query_string_error',
          message: 'query string is not defined'
        })
      } else resolve()
    })
  }

  // 1. 기술코드 목록 조회
  const getSkillCodeList = () => {
    return SkillCode.findOne({ codeType: type })
  }

  // 2. 응답
  const resp = (skillCodeInfo) => {
    if (!skillCodeInfo) {
      return Promise.reject({
        code: 'code_type_error',
        message: 'code type is not found'
      })
    } else {
      res.status(200).json({
        codeType: skillCodeInfo.codeType,
        items: skillCodeInfo.items
      })
    }
  }

  checkQueryString()
  .then(getSkillCodeList)
  .then(resp)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}