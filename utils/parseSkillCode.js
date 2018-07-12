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
    if (!skillCodeArr) return resolve([])
    SkillCode
    .findOne({
      codeType: type
    })
    .then((result) => {
      const skillCodeNameArr = skillCodeArr.map((skillCode) => {
        const item = _.find(result.items, { code: skillCode })
        return {
          code: skillCode,
          codeName: item.codeName,
          image: item.image
        }
      })
  
      resolve(skillCodeNameArr)
    })
    .catch((err) => { console.error(err) })
  })
}
