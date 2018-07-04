'use strict'

const Project = require('../../models/project')
const User = require('../../models/user')
const moment = require('moment')

/**
 * [API] 메인 프로젝트 목록 조회
 * @param {*} req
 * @param {*} res
 */
exports.getMainProjectList = (req, res) => {
  const page = req.query.page || 1
  const perPage = req.query.perPage || 3

  let pagingInfo = {}

  // 1. 최신 프로젝트 목록 조회
  const getProjectList = () => {
    return new Promise((resolve, reject) => {
      Project
      .find({})
      .sort('-createdDt')
      .paginate({
        perPage: perPage,
        delta  : 3,
        page   : page
      }, (err, results) => {
        if (err) return reject(err)

        const projectArr = results.results.map((project) => {
          return {
            title: project.title,
            text: project.text.substring(0, 30),
            startDate: moment(project.startDt).format('YYYY-MM-DD'),
            endDate: moment(project.endDt).format('YYYY-MM-DD'),
            hits: project.hits,
            applicantCount: project.applicant.length,
            writerId: project.userId
          }
        })

        pagingInfo.currentPage = results.current
        pagingInfo.lastPage = results.last
        pagingInfo.totalCount = results.count

        resolve(projectArr)
      })
    })
  }

  // 2. 작성자(PM) 정보 조회
  const getWriterInfo = (projectArr) => {
    const setUserInfoMany = projectArr.map((project) => {
      return setWriterInfo(project)
    })

    return Promise.all(setUserInfoMany)
  }

  // 3. 응답
  const resp = (projectList) => {
    res.status(200).json({
      projectList: projectList,
      currentPage: pagingInfo.currentPage,
      lastPage: pagingInfo.lastPage,
      totalCount: pagingInfo.totalCount
    })
  }

  getProjectList()
  .then(getWriterInfo)
  .then(resp)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}

/**
   * [Func] 작성자 정보 셋팅
   * @param {Object} projectInfo // 프로젝트 정보
   */
  const setWriterInfo = (projectInfo) => {
    return new Promise((resolve, reject) => {
      User
      .findOne({
        userId: projectInfo.writerId
      })
      .then((userInfo) => {
        projectInfo.writerInfo = {
          profileImage: userInfo.profileImage.resized.s3Location ? userInfo.profileImage.resized.s3Location : 'https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png',
          nickName: userInfo.nickName
        }

        resolve(projectInfo)
      })
      .catch((err) => {
        return reject(err)
      })
    })
  }