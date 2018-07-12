'use strict'

const Project = require("../../models/project")
const User = require("../../models/user")

exports.Comments = (req, res) => {
    const projId = req.body.pId || req.query.pId

    //1. QueryString 체크
    const CheckQueryString = () => {
        return new Promise((resolve, reject) => {
            if (!projId) {
                return reject({
                    code: 'query_string_error',
                    message: 'query string is not defined'
                })
            } else resolve()
        })
    }

    //2. Project 있는지 확인한 후에
    const CheckProjectAndReturn = () =>{
        return new Promise((resolve, reject) => {
            Project.findOne({_id: projId}).exec((err, proj)=>{
                if (err) throw err
                if (!proj) {
                    return reject({
                        code: 'project_doesn\'t_exist',
                        message: 'project doesn\'t exist'
                    })
                }
                else {
                    res.status(200).json(proj.comments)
                }
            })
        })
    }

    CheckQueryString()
        .then(CheckProjectAndReturn)
        .catch((err) => {
            if (err)
                res.status(500).send(err)
        })
}
exports.AddComment = (req, res) => {
    const projId = req.body.pId || req.query.pId // 프로젝트 ID
    const userId = req.body.uId || req.query.uId // User ID
    const Contents = req.body.contents || req.query.contents// 내용

    //1. QueryString 체크
    const CheckQueryString = () => {
        return new Promise((resolve, reject) => {
            if (!projId || !userId || !Contents) {
                return reject({
                    code: 'query_string_error',
                    message: 'query string is not defined'
                })
            } else resolve()
        })
    }

    //2. 프로젝트 존재하는지 체크
    const CheckExistProj = () => {
        return new Promise((resolve, reject) => {
            Project.findOne({_id :projId}).exec((err, project) => {
                if (err) throw err

                if(!project) {
                    return reject({
                        code: 'project_error',
                        message: 'project doesn`t exist'
                    })
                }
                else{
                    resolve(project)
                }
            })
        })
    }
    //3. 유저 존재하는지 체크
    const CheckExistUser = (Proj) => {
        return new Promise((resolve, reject) => {
            User.findOne({_id : userId}).exec((err, user) => {
                if (!user) {
                    return reject({
                        code: 'user_error',
                        message: 'user doesn`t exist'
                    })
                }
                else {
                    resolve(Proj)
                }
            })
        })
    }


    //4. 최종 결과 반환
    const Results = (Proj) => {
        let comment = {
            commenterId: userId,
            contents: Contents,
            date: Date.now()
        }
        Proj.comments.push(comment)
        Proj.save((err, object) => {
            if (err) throw err
            res.status(200).send(comment)
        })
    }

    CheckQueryString().
        then(CheckExistProj).
        then(CheckExistUser).
        then(Results).catch((err)=>{
            res.status(500).send(err)
    })
}
exports.DeleteComment = (req, res) =>{
    const projId = req.body.pId || req.query.pId // 프로젝트 ID
    const commentId = req.body.cId || req.query.cId // Comment ID
    const userId = req.body.uId || req.query.uId // User ID 혹은 PM ID

    //1. QueryString 체크
    const CheckQueryString = () => {
        return new Promise((resolve, reject) => {
            if (!projId || !userId || !commentId) {
                return reject({
                    code: 'query_string_error',
                    message: 'query string is not defined'
                })
            } else resolve()
        })
    }

    //2. 프로젝트 존재하는지 체크
    const CheckExistProj = () => {
        return new Promise((resolve, reject) => {
            Project.findOne({_id :projId}).exec((err, project) => {
                if (err) throw err

                if(!project) {
                    return reject({
                        code: 'project_error',
                        message: 'project doesn`t exist'
                    })
                }
                else{
                    resolve(project)
                }
            })
        })
    }

    //3. 댓글 존재하는 지, 유저 일치하는지 체크
    const CheckExistUser = (Proj) => {
        return new Promise((resolve, reject) => {
            let index = Proj.comments.findIndex(x => x._id == commentId)

            if (index == -1){
                return reject({
                    code: 'comment_not_exist',
                    message: 'comment not exist'
                })
            }

            if (Proj.comments[index].commenterId == userId){
                Proj.comments.splice(index, 1)
                Proj.save((err, object) =>{
                    if (err) throw err
                    res.status(200).send({success : true, removedByPM : false})
                })
            }
            else if (Proj.writerId == userId){
                Proj.comments.splice(index, 1)
                Proj.save((err, object) =>{
                    if (err) throw err
                    res.status(200).send({success : true, removedByPM : true})
                })
            }
            else {
                return reject({
                    code: 'user_dosen\'t_match',
                    message: 'user dosen\'t match'
                })
            }
        })
    }

    CheckQueryString().
        then(CheckExistProj).
        then(CheckExistUser).
        catch((err)=>{
            res.status(500).send(err)
    })
}
