'use strict'

const Project = require("../../models/project")

exports.lookupAllProject = (req, res) => {
    //0. Page 수 확인
    const pageNum = req.query.page || req.body.page
    const returnNum = req.query.num || req.body.num // 반환하는 프로젝트 수

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
        let list = Project.find().sort({_id : -1}).skip((pageNum-1)*returnNum).limit(returnNum).populate('pm_id')
        list.exec((err, posts) => {
            if (err) throw err
            res.status(200).json(posts)
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