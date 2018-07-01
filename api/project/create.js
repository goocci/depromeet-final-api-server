'use strict'

const Project = require("../../models/project")

/**
 * 프로젝트 생성
 * @param {*} req
 * @param {*} res
 */
exports.createProject = (req, res) => {
  const userId = req.body.userId
  const title = req.body.title
  const text = req.body.text
  const skillCodeDesigner = req.body.skillCodeDesigner
  const skillCodeDeveloper = req.body.skillCodeDeveloper

  // 0. 요청 바디 확인
  const checkReqBody = () => {
    return new Promise((resolve, reject) => {
      if (!userId || !title || !text || !skillCodeDesigner || !skillCodeDeveloper) {
        return reject({
          code: 'request_body_error',
          message: 'request body is not defined'
        })
      } else resolve()
    })
  }
}