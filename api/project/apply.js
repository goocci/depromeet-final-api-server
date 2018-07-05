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
            User.findone({_id: userId}).exec((err, user) => {
                if (err) throw err
                if (!user) {
                    return reject({
                        code: 'user_doesn\'t_exist',
                        message: 'user doesn\'t exist'
                    })
                }
            })
            Project.findOne({_id: projectId}).exec((err, proj) => {
                if (err) throw err
                if (!proj) {
                    return reject({
                        code: 'project_doesn\'t_exist',
                        message: 'project doesn\'t exist'
                    })
                }
                else {
                    let index = proj.applicant.findIndex(x => x._id == userId)
                    if (index == -1){
                        proj.applicant.push({
                            userId: userId,
                            join: false,
                            contents: contents
                        })
                        proj.save((err) => {
                            if (err)
                                throw err
                        })
                        res.status(200).json({
                            applySuccess: true
                        })
                    } else {
                        res.status(200).json({
                            applySuccess: false
                        })
                    }
                }
            })
        })
    }
    CheckQueryString()
        .then(CheckApplied)
        .catch((err)=>{
            if (err)
                res.status.json(err)
        })
}
exports.applyCancel = (req, res) => {
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
            User.findone({_id: userId}).exec((err, user) => {
                if (err) throw err
                if (!user) {
                    return reject({
                        code: 'user_doesn\'t_exist',
                        message: 'user doesn\'t exist'
                    })
                }
            })
            Project.findOne({_id: projectId}).exec((err, proj) => {
                if (err) throw err
                if (!proj) {
                    return reject({
                        code: 'project_doesn\'t_exist',
                        message: 'project doesn\'t exist'
                    })
                }
                else {
                    let index = proj.applicant.findIndex(x => x._id == userId)
                    if (index != -1){
                        proj.applicant.splice(index,1)
                        proj.save((err) => {
                            if (err)
                                throw err
                        })
                        res.status(200).json({
                            DeleteSuccess: true // 삭제 성공시
                        })
                    } else {
                        res.status(200).json({
                            DeleteSuccess: false // 삭제 실패시, (이미 존재하지 않을 시)
                        })
                    }
                }
            })
        })
    }
    CheckQueryString()
        .then(CheckApplied)
        .catch((err)=>{
            if (err)
                res.status.json(err)
        })
}