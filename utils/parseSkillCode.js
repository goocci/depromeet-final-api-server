'use strict'

const SkillCode = require("../models/skillCode")
const _ = require('lodash')

/**
 * 기술코드 파싱
 * @param {String} type // 기술코드 구분
 * @param {Array} skillCodeArr // 기술코드 배열
 */
exports.getSkillCodeName = (type, skillCodeArr) => {
  return new Promise((resolve, reject) => {
    SkillCode
    .findOne({
      codeType: type
    })
    .then((result) => {
      const skillCodeNameArr = skillCodeArr.map((skillCode) => {
        return {
          code: skillCode,
          codeName: _.find(result.items, { code: skillCode }).codeName
        }
      })
  
      resolve(skillCodeNameArr)
    })
  })
}
