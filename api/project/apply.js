'use strict'

const Project = require("../../models/project")
const User = require("../../models/user")

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
            User.findOne({_id: userId}).exec((err, user) => {
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
                    let index = proj.applicant.findIndex(x => x.userId == userId)
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
                            applySuccess: true // 지원 성공 시
                        })
                    } else {
                        res.status(200).json({
                            applySuccess: false // 중복 시
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
                res.status(500).json(err)
        })
}
exports.applyCancel = (req, res) => {
    const projectId = req.body.pId || req.query.pId
    const userId = req.body.uId || req.query.uId

    //1. QueryString 체크
    const CheckQueryString = () => {
        return new Promise((resolve, reject) => {
            if (!projectId || !userId) {
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
            User.findOne({_id: userId}).exec((err, user) => { // 유저 존재 확인
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
                    let index = proj.applicant.findIndex(x => x.userId == userId)
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
exports.applyList = (req, res) => {
    const projectId = req.body.pId || req.query.pId
    const PMId = req.body.PMId || req.query.PMId

    //1. QueryString 체크
    const CheckQueryString = () => {
        return new Promise((resolve, reject) => {
            if (!projectId || !PMId) {
                return reject({
                    code: 'query_string_error',
                    message: 'query string is not defined'
                })
            } else resolve()
        })
    }

    //2. Project, PM User 일치 여부
    const CheckExistProject = () => {
        return new Promise((resolve, reject) => {
            Project.findOne({_id: projectId}).exec((err, proj) => {
                if (err) throw err
                if (!proj){
                    return reject({
                        code: 'project_doesn\'t_exist',
                        message: 'project doesn\'t exist'
                    })
                }
                else {
                    if (proj.writerId == PMId){
                        res.status(200).json(proj.applicant)
                    }
                    else {
                        return reject({
                            code: 'not_match',
                            message: 'This Id does not match'
                        })
                    }
                }
            })
        })
    }

    CheckQueryString()
        .then(CheckExistProject)
        .catch((err)=>{
            if (err){
                res.status(500).json(err)
            }
        })
}
exports.applyToggle = (req, res) => {
    const projectId = req.body.pId || req.query.pId
    const PMId = req.body.PMId || req.query.PMId
    const userId = req.body.uId || req.query.uId

    //1. QueryString 체크
    const CheckQueryString = () => {
        return new Promise((resolve, reject) => {
            if (!projectId || !userId || !PMId) {
                return reject({
                    code: 'query_string_error',
                    message: 'query string is not defined'
                })
            } else resolve()
        })
    }

    //2. Project, PM User 일치 여부
    const CheckExistProject = () => {
        return new Promise((resolve, reject) => {
            Project.findOne({_id: projectId}).exec((err, proj) => {
                if (err) throw err
                if (!proj){
                    return reject({
                        code: 'project_doesn\'t_exist',
                        message: 'project doesn\'t exist'
                    })
                }
                else {
                    if (proj.writerId == PMId){
                        resolve(proj)
                    }
                    else {
                        return reject({ // PMID와 프로젝트의 PmId가 안겹칠때
                            code: 'not_match',
                            message: 'This Id does not match'
                        })
                    }
                }
            })
        })
    }

    //3. User ID 존재 여부, 있으면 토글
    const CheckUserID = (proj) => {
        return new Promise((resolve, reject) => {
            let index = proj.applicant.findIndex(x => x.userId)

            if (index == -1){
                return reject({
                    code: 'user_doesn\'t_exist',
                    message: 'user doesn\'t exist'
                })
            } else {
                if (proj.applicant[index].join == true){
                    proj.applicant[index].join = false
                    proj.save((err)=>{
                        if (err) throw err
                        else
                            res.status(200).json({join : false}) // true to false,
                    })
                }
                else {
                    proj.applicant[index].join = true
                    proj.save((err)=>{
                        if (err) throw err
                        else
                            res.status(200).json({join : true}) // false to true
                    })
                }
            }
        })
    }
    CheckQueryString()
        .then(CheckExistProject)
        .then(CheckUserID)
        .catch((err)=>{
            if (err) res.status(500).json(err)
        })
}