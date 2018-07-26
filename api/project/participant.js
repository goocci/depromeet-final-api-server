'use strict'

const Project = require('../../models/project')
const User = require('../../models/user')
const utils = require('../../utils')

/**
 * [API] 참여자 목록 조회
 * @param {*} req
 * @param {*} res
 */
exports.getParticipantList = (req, res) => {
  const projectId = req.query.projectId

  // 0. 쿼리스트링 확인
  const checkQueryString = () => {
    return new Promise((resolve, reject) => {
      if (!projectId) {
        return reject({
          code: 'query_string_error',
          message: 'query string is not defined'
        })
      } else resolve()
    })
  }

  // 1. 프로젝트 지원자 목록 조회
  const getProjectApplicantList = () => {
    return Project.findOne({ _id: projectId })
  }

  // 2. 참여자 정보 세팅
  const setParticipantInfo = (projectInfo) => {
    const findMany = projectInfo.applicant.map((applicant) => {
      return setUserInfo(applicant)
    })

    return Promise.all(findMany)
  }

  // 3. 프로젝트 진행수 산출
  const getProjectCount = (applicantArr) => {
    const applicantList = applicantArr.filter(elem => elem) // join:false 지원자 제외

    const findMany = applicantList.map((applicant) => {
      return setProjectCount(applicant)
    })

    return Promise.all(findMany)
  }

  // 3. 응답
  const resp = (applicantList) => {
    res.status(200).json(applicantList)
  }

  // [Func] 사용자 정보 세팅
  const setUserInfo = (applicant) => {
    return new Promise((resolve, reject) => {
      if (!applicant.join) return resolve() // join:false 지원자 제외
      User
      .findOne({
        userId: applicant.userId
      })
      .then((userInfo) => {
        async function parseCode () {
          const designSkillArr = await utils.parseSkillCode.getSkillCodeName('design', userInfo.skillCode.design)
          const frontendSkillArr = await utils.parseSkillCode.getSkillCodeName('frontend', userInfo.skillCode.frontend)
          const backendSkillArr = await utils.parseSkillCode.getSkillCodeName('backend', userInfo.skillCode.backend)

          resolve({
            userId: userInfo.userId,
            profileImage: userInfo.profileImage.resized.s3Location ? userInfo.profileImage.resized.s3Location : 'https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png',
            nickName: userInfo.nickName || '',
            realName: userInfo.realName || '',
            position: userInfo.position || '',
            area: userInfo.area || '',
            contact: userInfo.contact || '',
            skill: {
              design: designSkillArr,
              frontend: frontendSkillArr,
              backend: backendSkillArr
            },
            projectCount: 0
          })
        }

        parseCode()
      })
      .catch((err) => {
        return reject(err)
      })
    })
  }

  // [Func] 프로젝트 진행수 산출
  const setProjectCount = (applicant) => {
    return new Promise((resolve, reject) => {
      Project
      .find({
        $or: [
          {
            writerId: applicant.userId
          },
          {
            applicant: {
              $elemMatch: {
                userId: applicant.userId,
                join: true
              }
            }
          }
        ]
      })
      .count()
      .then((projectCount) => {
        applicant.projectCount = projectCount
        resolve(applicant)
      })
      .catch((err) => {
        return reject(err)
      })
    })
  }

  checkQueryString()
  .then(getProjectApplicantList)
  .then(setParticipantInfo)
  .then(getProjectCount)
  .then(resp)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}
