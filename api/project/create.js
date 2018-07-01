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

  // 1. 첨부파일 확인
  const checkAttachments = () => {
    if (req.files.length === 0) return Promise.resolve([]) // 첨부파일이 없다면 빈배열
    else {
      const attachmentsArr = req.files.map((file) => {
        return { // 첨부파일 정보객체 배열 생성
          fileName: file.originalname,
          s3Location: file.location,
          size: file.size
        }
      })
      return Promise.resolve(attachmentsArr)
    }
  }

  // 2. 프로젝트 생성
  const createNewProject = (attachmentsArr) => {
    return Project
          .create({
            userId: userId,
            title: title,
            text: text,
            skillCode: {
              designer: JSON.parse(skillCodeDesigner),
              developer: JSON.parse(skillCodeDeveloper)
            },
            attachments: attachmentsArr
          })
  }

  // 3. 응답
  const resp = (results) => {
    // [TODO] 프로젝트 상세화면에 필요한 데이터 응답 (=프로젝트 상세조회 API 응답 데이터)
    res.status(200).json(results)
  }

  checkReqBody()
  .then(checkAttachments)
  .then(createNewProject)
  .then(resp)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}