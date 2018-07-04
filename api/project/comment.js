'use strict'

const Project = require("../../models/project")
const User = require("../../models/user")

//Coding 중
exports.AddComment = (req, res) => {
    const pId = req.body.pId // 프로젝트 ID
    const uId = req.body.uId // User ID
    const contents = req.body.contents // 내용

    //1. QueryString 체크
    const checkQueryString = () => {
        return new Promise((resolve, reject) => {
            if (!pId || !uId || !contents) {
                return reject({
                    code: 'query_string_error',
                    message: 'query string is not defined'
                })
            } else resolve()
        })
    }

    //2. 프로젝트 존재하는지 체크
    const CheckExistProj = () => {
        const Proj = Project.findOne({_id : pId}).exec((err, proj) => {
            if (err)
                throw err

            return proj
        })



        if(!Proj) {
            return Promise.reject({
                code: 'project_error',
                message: 'project doesn`t exist'
            })
        }
        else{
            return Promise.resolve(Proj)
        }

    }
    //3. 유저 존재하는지 체크
    const CheckExistUser = (Proj) => {
        const User = User.findOne({_id : uId}).exec((err, user) => {
            if (err)
                throw err

            return user
        })

        if (!User) {
            return Promise.reject({
                code: 'user_error',
                message: 'user doesn`t exist'
            })
        }
        else {
            return Promise.resolve(Proj)
        }
    }


    //4. 최종 결과 반환
    const Results = (Proj) => {
        Proj.comments.push({
            commenterId: uId,
            contents: contents,
            date: Date.now()
        })
        Proj.save()
    }

    checkQueryString().
        then(CheckExistProj).
        then(CheckExistUser).
        then(Results).catch((err)=>{
            res.status(500).send(err)
    })
}
exports.DeleteComment = (req, res) =>{

}