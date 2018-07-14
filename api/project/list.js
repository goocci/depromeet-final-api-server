'use strict'

const Project = require('../../models/project')
const User = require('../../models/user')

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
            projectId: project._id,
            title: project.title,
            text: project.text.substring(0, 30),
            startDate: project.startDt,
            endDate: project.endDt,
            hits: project.hits,
            applicantCount: project.applicant.length,
            writerId: project.writerId
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

/**
 * [API] 내가 등록한 프로젝트 목록 조회
 * @param {*} req
 * @param {*} res
 */
exports.getMyProjectList = (req, res) => {
  const userId = req.query.userId
  const page = req.query.page || 1
  const perPage = req.query.perPage || 5

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

  // 1. 내가 등록한 프로젝트 목록 조회
  const getMyProject = () => {
    return new Promise((resolve, reject) => {
      Project
      .find({ writerId: userId })
      .sort('-createdDt')
      .paginate({
        perPage: perPage,
        delta  : 3,
        page   : page
      }, (err, results) => {
        if (err) return reject(err)

        const projectArr = results.results.map((project) => {
          return {
            projectId: project._id,
            title: project.title,
            text: project.text.substring(0, 30),
            startDate: project.startDt,
            endDate: project.endDt,
            hits: project.hits,
            applicantCount: project.applicant.length
          }
        })

        res.status(200).json({
          projectList: projectArr,
          currentPage: results.current,
          lastPage: results.last || 1,
          totalCount: results.count
        })
      })
    })
  }

  checkQueryString()
  .then(getMyProject)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}

/**
 * [API] 내가 지원한 프로젝트 목록 조회
 * @param {*} req
 * @param {*} res
 */
exports.getMyApplyProjectList = (req, res) => {
  const userId = req.query.userId
  const page = req.query.page || 1
  const perPage = req.query.perPage || 5

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

  // 1. 내가 지원한 프로젝트 목록 조회
  const getMyApplyProject = () => {
    return new Promise((resolve, reject) => {
      Project
      .find({
        applicant: {
          $elemMatch: {
            userId: userId
          }
        }
      })
      .sort('-createdDt')
      .paginate({
        perPage: perPage,
        delta  : 3,
        page   : page
      }, (err, results) => {
        if (err) return reject(err)

        const projectArr = results.results.map((project) => {
          return {
            projectId: project._id,
            title: project.title,
            text: project.text.substring(0, 30),
            startDate: project.startDt,
            endDate: project.endDt,
            hits: project.hits,
            applicantCount: project.applicant.length
            // [TODO]
            // 나의 참여확정된 프로젝트 목록이 따로 있다면, 이 API에서는 join:false 프로젝트 목록만
            // 나의 참여확정된 프로젝트 목록이 따로 없다면, 이 API에서 isJoin(참여확정여부) 응답값 추가          
          }
        })

        res.status(200).json({
          projectList: projectArr,
          currentPage: results.current,
          lastPage: results.last || 1,
          totalCount: results.count
        })
      })
    })
  }

  checkQueryString()
  .then(getMyApplyProject)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}