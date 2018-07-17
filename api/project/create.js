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
  const text = req.body.text
  const startDt = req.body.startDate
  const endDt = req.body.endDate
  const positionNeed = req.body.positionNeed

  let projectInfo

  // 0. 요청 바디 확인
  const checkReqBody = () => {
    return new Promise((resolve, reject) => {
      if (!userId || !title || !text || !startDt || !endDt || !positionNeed) {
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
    const positionNeedArr = JSON.parse(positionNeed).map((positionName) => {
      let imageUrl
      switch (positionName) {
        case 'ui-designer':
          imageUrl = 'https://s3.ap-northeast-2.amazonaws.com/d4d-bucket/ic-ui%403x.png'
          break
        case 'ux-designer':
          imageUrl = 'https://s3.ap-northeast-2.amazonaws.com/d4d-bucket/ic-ux%403x.png'
          break
        case 'frontend':
          imageUrl = 'https://s3.ap-northeast-2.amazonaws.com/d4d-bucket/ic-front%403x.png'
          break
        case 'backend':
          imageUrl = 'https://s3.ap-northeast-2.amazonaws.com/d4d-bucket/ic-back%403x.png'
          break
        default:
          imageUrl = ''
      }

      return {
        name: positionName,
        image: imageUrl
      }
    })

    return Project
          .create({
            writerId: userId,
            title: title,
            text: text,
            startDt: startDt,
            endDt: endDt,
            positionNeed: positionNeedArr,
            attachments: attachmentsArr,
            applicant: []
          })
  }

  // 3. 작성자 정보 조회
  const getWriterInfo = (result) => {
    projectInfo = result
    return User.findOne({ userId: userId })
  }

  // 4. 응답 데이터 Setting
  const setRespData = (userInfo) => {
    return new Promise((resolve, reject) => {
      let attachments = projectInfo.attachments.map((att) => {
        return {
          fileName: att.fileName,
          downloadUrl: att.s3Location
        }
      })

      async function parseCode () {
        try {
          const designSkillArr = await utils.parseSkillCode.getSkillCodeName('design', userInfo.skillCode.design)
          const frontendSkillArr = await utils.parseSkillCode.getSkillCodeName('frontend', userInfo.skillCode.frontend)
          const backendSkillArr = await utils.parseSkillCode.getSkillCodeName('backend', userInfo.skillCode.backend)

          let response = {
            projectInfo: {
              projectId: projectInfo._id,
              positionNeed: projectInfo.positionNeed,
              hits: projectInfo.hits,
              title: projectInfo.title,
              text: projectInfo.text,
              startDate: startDt,
              endDate: endDt,
              attachments: attachments,
              comments: projectInfo.comments
            },
            writerInfo: {
              writerId: userInfo.userId,
              nickName: userInfo.nickName,
              profileImage: userInfo.profileImage.resized.s3Location ? userInfo.profileImage.resized.s3Location : 'https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png',
              area: userInfo.area || '',
              position: userInfo.position || '',
              contact: userInfo.contact || '',
              skill: {
                design: designSkillArr,
                frontend: frontendSkillArr,
                backend: backendSkillArr
              },
              projectCount: 0
            },
            isWriter: true // 프로젝트 생성자가 무조건 작성자
          }
          resolve(response)
        } catch (err) {
          return reject(err)
        }
      }

      parseCode()
    })
  }

  // 5. 작성자 프로젝트 진행수 산출 및 응답
  const getProjectCountAndResp = (response) => {
    return new Promise((resolve, reject) => {
      Project
      .find({
        $or: [
          {
            writerId: response.writerInfo.writerId
          },
          {
            applicant: {
              $elemMatch: {
                userId: response.writerInfo.writerId,
                join: true
              }
            }
          }
        ]
      })
      .count()
      .then((projectCount) => {
        response.writerInfo.projectCount = projectCount
        res.status(200).json(response)
      })
      .catch((err) => {
        return reject(err)
      })
    })
  }

  checkReqBody()
  .then(checkAttachments)
  .then(createNewProject)
  .then(getWriterInfo)
  .then(setRespData)
  .then(getProjectCountAndResp)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}
