'use strict'

const Project = require("../../models/project")
const moment = require("moment")

exports.lookupAllProject = (req, res) => {
    //0. Page 수 확인
    const pageNum = Number(req.query.page || req.body.page)
    const returnNum = Number(req.query.num || req.body.num) // 반환하는 프로젝트 수

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


    // 2. 응답, Page 수에 맞는 최신 글 12개 리턴
    const resp = () => {
        let list = Project.find().sort({_id : -1}).skip((pageNum-1)*returnNum).limit(returnNum)
        list.exec((err, posts) => {
            if (err) throw err
            else {
                const postList = posts.map((post) => {
                    return {
                        title: post.title,
                        text: post.text.substring(0, 30),
                        startDate: moment(post.startDt).format('YYYY-MM-DD'),
                        endDate: moment(post.endDt).format('YYYY-MM-DD'),
                        hits: post.hits,
                        applicantCount: post.applicant.length,
                        writerId: post.userId
                    }
                })
                res.status(200).json(postList)
            }
        })
    }
    checkQueryString()
        .then(resp)
        .catch((err) => {
            console.error(err)
            return res.status(500).json(err.message || err)
        })
}

exports.lookupDetail = (req, res) => {
    //0. Project id 입력받음
    const pId = req.query.id || req.body.id

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
                res.status(200).json({empty : 1})
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