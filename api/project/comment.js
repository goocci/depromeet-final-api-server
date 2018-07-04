'use strict'

const Project = require("../../models/project")

// Promise 할 것
exports.AddComment = (req, res) => {
    const pId = req.body.pId // 프로젝트 ID
    const uId = req.body.uId // User ID
    const contents = req.body.contents // 내용

    const addComment = (pId, uId, Contents) => {
        Project.findOne({_id : pId}).exec((err, proj) => {
            if (err)
                throw err
            console.log(proj)
            proj.comments.push({
                commenterId: uId,
                contents: Contents,
            })
            proj.save((err) => {
                if (err) throw err
            })
        })
    }
    addComment(pId, uId, contents, (err) => {
        if (err){
            res.send({error : 1})
        }
        else {
            res.send({error : 0})
        }
    })
}
exports.DeleteComment = (req, res) =>{

}