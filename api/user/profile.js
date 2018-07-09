'use strict'

const User = require("../../models/user")
const utils = require('../../utils')

exports.write = (req, res) => {
    const userId = req.body.uId || req.query.uId
    const introduction = req.body.introduction || req.query.introduction

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

    //2. User Id 존재하는지 판별 후, Introduction 수정
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
                    user.save((err, obj) =>{
                        if(err) throw err
                        res.status(200).json(obj)
                    })
                }
            })
        })
    }
    CheckQueryString()
        .then(CheckUserExist)
        .catch((err)=>{
            if(err){
                res.status(500).json(err)
            }
        })
}

/**
 * 프로필 정보 조회
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
        const designerSkillArr = await utils.parseSkillCode.getSkillCodeName('designer', userInfo.skillCode.designer)
        const developerSkillArr = await utils.parseSkillCode.getSkillCodeName('developer', userInfo.skillCode.developer)
  
        resolve({
          userInfo: userInfo,
          designerSkillArr: designerSkillArr,
          developerSkillArr: developerSkillArr
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
        designer: data.designerSkillArr,
        developer: data.developerSkillArr
      }
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
