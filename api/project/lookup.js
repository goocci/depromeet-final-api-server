'use strict'

const Project = require("../../models/project")
const User = require("../../models/user")
const moment = require("moment")

exports.lookupAllProject = (req, res) => {
    //0. Page 수 확인
    const pageNum = Number(req.body.page)
    const returnNum = Number(req.body.num) // 반환하는 프로젝트 수

    let pagingInfo = {}

    //1. QueryString 체크
    const checkQueryString = () => {
        return new Promise((resolve, reject) => {
            if (!pageNum || !returnNum) {
                return reject({
                    code: 'query_string_error',
                    message: 'query string is not defined'
                })
            } else resolve()
        })
    }


    // 2. Page 수에 맞는 최신 글 12개 정보 요약
    const MakeSimple = () => {
        return new Promise((resolve, reject) => {
            let list = Project.find().sort({_id : -1}).skip((pageNum-1)*returnNum).limit(returnNum)
            list.exec((err, posts) => {
                if (err) return reject(err)
                else {
                    const postList = posts.map((post) => {
                        return {
                            projectId: post._id,
                            title: post.title,
                            text: post.text.substring(0, 30),
                            startDate: post.startDt,
                            endDate: post.endDt,
                            hits: post.hits,
                            applicantCount: post.applicant.length,
                            writerId: post.userId
                        }
                    })
                    resolve(postList)
                }
            })
        })
    }

    //3. postList 반환
    const resp = (postList) => {
        let newPostList = postList.map((project)=> {
            User.findOne({userId: project.writerId}).exec((err, obj) =>{
                if (err) throw err

                if (!obj){
                    project.writerInfo = {}
                }
                if (Object(obj).hasOwnProperty('profileImage')){
                    project.writerInfo = {
                        profileImage: obj.profileImage.resized.s3Location,
                        nickName: obj.nickName || ''
                    }
                }
                else {
                    project.writerInfo = {
                        profileImage: 'https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png',
                        nickName: obj.nickName || ''
                    }
                }
                return project
            })
        })
        res.status(200).json(newPostList)
        }




    checkQueryString()
        .then(MakeSimple)
        .then(resp)
        .catch((err) => {
            console.error(err)
            return res.status(500).json(err.message || err)
        })
}


exports.lookupDetail = (req, res) => {
    //0. Project id 입력받음
    const pId = req.body.id

    //1. QueryString 체크
    const checkQueryString = () => {
        return new Promise((resolve, reject) => {
            if (!pId || pId == undefined) {
                return reject({
                    code: 'query_string_error',
                    message: 'query string is not defined'
                })
            } else resolve()
        })
    }

    //2. Project 존재 유무 판별
    const ProjectInfo = () => {
        return new Promise((resolve, reject) => {
            Project.findOne({_id: pId}).exec((err, proj) => {
                if (err) throw err

                if (!proj) {
                    return reject({
                        code: 'project_does_not_exist',
                        message: 'project does_not_exist'
                    })
                }
                else {
                    let user_obj = {}
                    User.findOne({userId: proj.writerId}).exec((err, obj) => {
                        if (err) throw err;

                        if (!obj) {
                            return reject({
                                code: 'user_does_not_exist',
                                message: 'User does not exist'
                            })
                        }
                        else {
                            user_obj = {
                                nickName: obj.nickName || '',
                                realName: obj.realName || '',
                                resizedProfileImage: obj.profileImage.resized || [],
                                area: obj.area || '',
                                projectNum: obj.projectNum || '',
                                position: obj.position || '',
                                backendSkill: obj.skillCode.backend || [],
                                frontendSkill: obj.skillCode.frontend || [],
                                designSkill: obj.skillCode.design || [],
                                email: obj.email || ''
                            }
                            let json_obj = {
                                writerId: proj.writerId,
                                userObj: user_obj,
                                title: proj.title,
                                text: proj.text,
                                startDt: proj.startDt,
                                endDt: proj.endDt,
                                positionNeed: proj.positionNeed,
                                attachments: proj.attachments
                            }
                            res.status(200).json(json_obj)
                        }
                    })
                }
            })
        })
    }
    checkQueryString().then(ProjectInfo).catch((err) => {
        if (err)
            res.status(500).send(err)
    })
}


