'use strict'

const User = require("../../models/user")
const utils = require('../../utils')
const path = require('path')

const SkillCodeArrayParse = (arrayString) = {

}

exports.write = (req, res) => {
    const userId = req.body.uId // User Id
    const projectNum = req.body.projectNum //
    const position = req.body.position //
    const UIUXSkillArray = req.body.uiuxskillarray // Json의 배열로 기술명, 숙련도 배열 받음
    const FrontSkillArray = req.body.frontskillarray // Json의 배열로 기술명, 숙련도 배열 받음
    const BackSkillArray = req.body.backskillarray // Json의 배열로 기술명, 숙련도 배열 받음
    const email = req.body.email || ''
    const area = req.body.area || ''

    //1. QueryString 체크
    const CheckQueryString = () => {
        return new Promise((resolve, reject) => {
            if (!userId || !introduction) {
                return reject({
                    code: 'query_string_error',
                    message: 'query string is not defined'
                })
            } else resolve()
        })
    }

    //2. User Id 존재하는지 판별 후, Introduction, SkillCode 수정
    const CheckUserExist = () => {
        return new Promise((resolve, reject) => {
            User.findOne({userId: userId}).exec((err, user)=>{
                if (err) throw err
                if (!user){
                    return reject({
                        code: 'user_doesn\'t_exist',
                        message: 'user doesn\'t exist'
                    })
                }
                else {
                    user.projectNum = projectNum
                    user.updatedDt = Date.now()
                    user.position = position
                    user.email = email
                    user.area = area

                    if (!UIUXSkillArray) {
                        user.skillCode.design = JSON.parse(UIUXSkillArray)
                    }
                    if (!FrontSkillArray) {
                        user.skillCode.frontend = JSON.parse(FrontSkillArray)
                    }
                    if (!BackSkillArray) {
                        user.skillCode.backend = JSON.parse(BackSkillArray)
                    }
                    resolve(user)
                }
            })
        })
    }

    //3. Image File Upload
    const imageUpload = (user) => {
        return new Promise((resolve, reject) => {
            if (req.file){
                let fileName = path.basename(req.file.location).slice(path.basename.indexOf('_')+1)
                let dirname = path.dirname(req.file.location)
                let resizedDirname = path.dirname.replace('images/original', 'copy/images')
                user.profileImage.original.fileName = fileName || ''
                user.profileImage.original.s3Location = req.file.location || ''
                user.profileImage.original.size = req.file.size || ''
                user.profileImage.resized.fileName = fileName || ''
                user.profileImage.resized.s3Location = req.file.location || ''
                user.profileImage.resized.size = req.file.size || '' // 어캐 구현 하죠..?
                user.updatedDt = Date.now()
            }
            user.save((err, obj) =>{
                if(err) throw err
            })
            resolve(user)
        })
    }

    //4. 응답
    const response = (user) => {
        const returnValue = {
            userId: user.userId,
            position: user.position,
            email: user.email,
            area: user.area,
            backendSkill: user.skillCode.backend,
            frontendSkill: user.skillCode.frontend,
            designSkill: user.skillCode.design,
            profileImage: user.profileImage,
            projectNum: user.projectNum
        }
        res.status(200).json(returnValue)
    }

    CheckQueryString()
        .then(CheckUserExist)
        .then(imageUpload)
        .then(response)
        .catch((err)=>{
            if(err){
                res.status(500).json(err)
            }
        })
}

/**
 * 나의 프로필 정보 조회
 * @param {*} req
 * @param {*} res
 */
exports.getMyProfile = (req, res) => {
  const userId = req.query.userId

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

  // 1. 사용자 정보 조회
  const getUserInfo = () => {
    return User.findOne({ userId: userId })
  }

  // 2. 기술코드 파싱
  const parseSkillCode = (userInfo) => {
    return new Promise((resolve, reject) => {
      async function parseCode() {
        const designSkillArr = await utils.parseSkillCode.getSkillCodeName('design', userInfo.skillCode.design)
        const frontendSkillArr = await utils.parseSkillCode.getSkillCodeName('frontend', userInfo.skillCode.frontend)
        const backendSkillArr = await utils.parseSkillCode.getSkillCodeName('backend', userInfo.skillCode.backend)
  
        resolve({
          userInfo: userInfo,
          designSkillArr: designSkillArr,
          frontendSkillArr: frontendSkillArr,
          backendSkillArr: backendSkillArr
        })
      }
  
      parseCode()
      .catch((err) => {
        return reject(err)
      })
    })
  }

  // 3. 사용자 정보 응답
  const respUserInfo = (data) => {
    let userInfo = data.userInfo
    res.status(200).json({
      userId: userInfo.userId,
      email: userInfo.email,
      nickName: userInfo.nickName,
      realName: userInfo.realName || '', 
      snsType: userInfo.snsType,
      profileImage: userInfo.profileImage.resized.s3Location ? userInfo.profileImage.resized.s3Location : 'https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png',
      introduction: userInfo.introduction || '',
      skill: {
        design: data.designSkillArr,
        frontend: data.frontendSkillArr,
        backend: data.backendSkillArr
      },
      area: userInfo.area || '',
      position: userInfo.position || '',
      contact: userInfo.contact || ''
    })
  }

  checkQueryString()
  .then(getUserInfo)
  .then(parseSkillCode)
  .then(respUserInfo)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}

/**
 * 나의 프로필 정보 Tooltip 조회
 * @param {*} req
 * @param {*} res
 */
exports.getMyProfileTooltip = (req, res) => {
  const userId = req.query.userId

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

  // 1. 사용자 정보 조회
  const getUserInfo = () => {
    return User.findOne({ userId: userId })
  }

  // 2. 사용자 정보 응답
  const respUserInfo = (userInfo) => {
    res.status(200).json({
      userId: userInfo.userId,
      email: userInfo.email,
      nickName: userInfo.nickName,
      realName: userInfo.realName || '', 
      profileImage: userInfo.profileImage.resized.s3Location ? userInfo.profileImage.resized.s3Location : 'https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png'
    })
  }

  checkQueryString()
  .then(getUserInfo)
  .then(respUserInfo)
  .catch((err) => {
    console.error(err)
    return res.status(500).json(err.message || err)
  })
}
exports.LookupSimpleProflie = (req, res) => {
    const userId = req.body.uId

    const SendUserSimpleProfile = (userId) => {
        return new Promise((resolve, reject) => {
            User.findOne({userId: userId}).exec((err, obj) => {
                if (err) throw err;

                if (!obj){
                    return reject({
                        code: 'user_does_not_exist',
                        message: 'User does not exist'
                    })
                }
                else {
                    res.status(200).send({
                        nickName: obj.nickName,
                        realName: obj.realName,
                        resizedProfileImage: obj.resized.s3Location ? userInfo.profileImage.resized.s3Location : 'https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png',
                        area: obj.area,
                        projectNum: obj.projectNum,
                        position: obj.position,
                        backendSkill: obj.skillCode.backend,
                        frontendSkill: obj.skillCode.frontend,
                        designSkill: obj.skillCode.design,
                        email: obj.email
                    })
                }
            })
        })
    }

    SendUserSimpleProfile(userId)
        .catch((err) => {
            if (err)
                req.status(500).send(err)
        })
}
