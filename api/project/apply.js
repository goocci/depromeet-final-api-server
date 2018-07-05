'use strict'

const Project = require("../../models/project")

exports.apply = (req, res) => {
    const projectId = req.body.pId || req.query.pId
    const userId = req.body.uId || req.query.uId
    const contents = req.body.contents || req.query.contents

    //1. QueryString 체크
    const CheckQueryString = () => {
        return new Promise((resolve, reject) => {
            if (!projectId || !userId || !contents) {
                return reject({
                    code: 'query_string_error',
                    message: 'query string is not defined'
                })
            } else resolve()
        })
    }

    //2. 신청 여부 확인
    const CheckApplied = () => {
        return new Promise((resolve, reject) => {
            let index = Project.applicant.findIndex(x => x._id == commentId)
            if (index == -1){

            }
            else {

            }
        })
    }
}
exports.applyCancel = (req, res) => {

}