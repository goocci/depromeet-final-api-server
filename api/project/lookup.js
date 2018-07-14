'use strict'

const Project = require("../../models/project")
const moment = require("moment")

exports.lookupAllProject = (req, res) => {
    //0. Page 수 확인
    const pageNum = Number(req.query.page)
    const returnNum = Number(req.query.num) // 반환하는 프로젝트 수

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
        const newPostList = postList.map((project)=>{
            return setWriterInfo(project)
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

const setWriterInfo = (projectInfo) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            userId: projectInfo.writerId
        })
            .then((userInfo) => {
                projectInfo.writerInfo = {
                    profileImage: userInfo.profileImage.resized.s3Location ? userInfo.profileImage.resized.s3Location : 'https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png',
                    nickName: userInfo.nickName
                }

                resolve(projectInfo)
            })
            .catch((err) => {
                return reject(err)
            })
    })
}

exports.lookupDetail = (req, res) => {
    //0. Project id 입력받음
    const pId = req.query.id

    //1. QueryString 체크
    const checkQueryString = () => {
        return new Promise((resolve, reject) => {
            if (!pId) {
                return reject({
                    code: 'query_string_error',
                    message: 'query string is not defined'
                })
            } else resolve()
        })
    }

    //1. Project 존재 유무 판별
    const ProjectInfo = () => {
        Project.findOne({_id: pId}).exec((err, proj) => {
            if (err) throw err

            if (!proj){
                res.status(200).json({})
            }
            else {
                res.status(200).json(proj)
            }
        })

    }
    checkQueryString().
        then(ProjectInfo).
        catch((err)=>{
            if (err) throw err
            res.status(500).send(err)
    })
}