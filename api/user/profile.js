'use strict'

const User = require("../../models/user")

exports.write = (req, res) => {
    const userId = req.body.uId || req.query.uId
    const introduction = req.body.introduction || req.query.introduction

    //1. QueryString 체크
    const CheckQueryString = () => {
        return new Promise((resolve, reject) => {
            if (!userId || !introduction) {
                return reject({
                    code: 'query_string_error',
                    message: 'query string is not defined'
                })
            } else resolve()
        })
    }

    //2. User Id 존재하는지 판별 후, Introduction 수정
    const CheckUserExist = () => {
        return new Promise((resolve, reject) => {
            User.findOne({_id: userId}).exec((err, user)=>{
                if (err) throw err
                if (!user){
                    return reject({
                        code: 'user_doesn\'t_exist',
                        message: 'user doesn\'t exist'
                    })
                }
                else {
                    user.introduction = introduction
                    user.updatedDt = Date.now()
                    user.save((err, obj) =>{
                        if(err) throw err
                        res.status(200).json(obj)
                    })
                }
            })
        })
    }
    CheckQueryString()
        .then(CheckUserExist)
        .catch((err)=>{
            if(err){
                res.status(500).json(err)
            }
        })
}