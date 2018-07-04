'use strict'

const Project = require('../../models/project')
const User = require('../../models/user')
const utils = require('../../utils')

/**
 * 프로젝트 생성
 * @param {*} req
 * @param {*} res
 */
exports.createProject = (req, res) => {
  const userId = req.body.userId
  const title = req.body.title
  const startDt = req.body.startDate // [TODO] utc?
  const endDt = req.body.endDate // [TODO] utc?
  const text = req.body.text
  const skillCodeDesigner = req.body.skillCodeDesigner
  const skillCodeDeveloper = req.body.skillCodeDeveloper

  let projectInfo
  let userInfo
  let designerSkillArr = []
  let developerSkillArr = []

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
            startDt: startDt,
            endDt: endDt,
            skillCode: {
              designer: JSON.parse(skillCodeDesigner),
              developer: JSON.parse(skillCodeDeveloper)
            },
            attachments: attachmentsArr,
            applicant: []
          })
  }

  // 3. 작성자 정보 조회
  const getWriterInfo = (result) => {
    projectInfo = result
    return User.findOne({ userId: userId })
  }

  // 4. 기술코드 파싱
  const parseProjectSkillCode = (result) => {
    return new Promise((resolve, reject) => {
      userInfo = result
      async function parseCode() {
        designerSkillArr = await utils.parseSkillCode.getSkillCodeName('designer', projectInfo.skillCode.designer)
        developerSkillArr = await utils.parseSkillCode.getSkillCodeName('developer', projectInfo.skillCode.developer)
  
        resolve()
      }
  
      parseCode()
    })
  }

  // 5. 응답
  const resp = () => {
    let profileImage = 'https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png'
    if (userInfo.profileImage) profileImage = userInfo.profileImage.resized.s3Location

    let attachments = projectInfo.attachments.map((att) => {
      return {
        fileName: att.fileName,
        downloadUrl: att.s3Location
      }
    })

    let response = {
      projectInfo: {
        projectId: projectInfo._id,
        skill: {
          designer: designerSkillArr,
          developer: developerSkillArr
        },
        hits: projectInfo.hits,
        title: projectInfo.title,
        text: projectInfo.text,
        startDate: startDt,
        endDate: endDt,
        attachments: attachments
      },
      writerInfo: {
        userId: userInfo.userId,
        nickName: userInfo.nickName,
        profileImage: profileImage
      },
      isWriter: true // 프로젝트 생성자가 무조건 작성자
    }

    res.status(200).json(response)
  }

  checkReqBody()
  .then(checkAttachments)
  .then(createNewProject)
  .then(getWriterInfo)
  .then(parseProjectSkillCode)
  .then(resp)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}