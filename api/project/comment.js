'use strict'

const Project = require("../../models/project")

//실험을 아직 안함
exports.WriteComment = (req, res) => {
    const pId = req.body.pId // 프로젝트 ID
    const uId = req.body.uId // User ID
    const contents = req.body.contents // 내용

    const addComment = (pId, uId, Contents) => {
        Project.findById(pId,(err, proj) => {
            if (err)
                throw err
            proj.comment.push({
                commenterId : uId,
                contents : Contents,
                date : Date.now()
            })
            proj.save((err) => {
                if(err) throw err
            })
        })
    }
    addComment(pId, uId, contents, (err) => {
        if (err){
            req.send({error : 1})
        }
        else {
            req.send({error : 0})
        }
    })
}