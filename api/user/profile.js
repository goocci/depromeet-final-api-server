'use strict'

const User = require("../../models/user")
const utils = require('../../utils')
const path = require('path')

exports.write = (req, res) => {
    const userId = req.body.uId // User Id
    const introduction = req.body.introduction // 자기 소개
    const DevSkillArray = req.body.devSkill || []
    const DesSkillArray = req.body.desSkill || []
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
            User.findOne({_id: userId}).exec((err, user)=>{
                if (err) throw err
                if (!user){
                    return reject({
                        code: 'user_doesn\'t_exist',
                        message: 'user doesn\'t exist'
                    })
                }
                else {
                    user.introduction = introduction
                    user.updatedDt = Date.now()
                    user.skillCode.developer = DevSkillArray
                    user.skillCode.designer = DesSkillArray
                    user.email = email
                    user.area = area
                    resolve(user)
                }
            })
        })
    }

    //3. Image File Upload
    const imageUpload = (user) => {
        return new Promise((resolve, reject) => {
            if (req.file){
                let fileName = path.basename(req.file.location)
                let dirname = path.dirname(req.file.location)
                let resizedDirname = dirname.replace('images/original', 'copy/images')
                user.profileImage.original.fileName = fileName || ''
                user.profileImage.original.s3Location = dirname || ''
                user.profileImage.original.size = req.file.size || ''
                user.profileImage.resized.fileName = fileName || ''
                user.profileImage.resized.s3Location = resizedDirname || ''
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
            introduction: user.introduction,
            email: user.email,
            area: user.area,
            devArray: user.skillCode.developer,
            desArray: user.skillCode.designer,
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
