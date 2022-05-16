require('dotenv').config()
const ApiError = require('../errors/apiError')
require ('../service/authService');
const bcrypt = require ('bcrypt');
const User = require('../models/User')
const path = require ('path');
const uuid = require('uuid');
const fs = require("fs");
const {uploadImg, getImg} = require ('../utils/s3');

class UserController{
    async image(req, res, next){
        try{
            console.log(req.params.key)
            const key = req.params.key
            const readStream = getImg(key)
            readStream.pipe(res)
        }catch (e) {
            next(ApiError.BadRequest(e.message))
        }
    }
    async getOne(req, res, next){
        try{
            const {id} = req.params
            const user = await User.find({_id: id})
            res.json(user)

        }catch (e) {
            next(ApiError.BadRequest(e.message))
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await User.find({})
            res.json(users)
        } catch (e) {
            next(ApiError.BadRequest(e.message))
        }
    }
    async updateOne(req, res, next){
        try{
            const {id} = req.params
               let {password} = req.body
               if(password){
              password =  await bcrypt.hash(password, 2)
              return password
           }
            const {username, city, work, description } = req.body
            if(username) {
                const user = await User.findByIdAndUpdate (id, {$set: {username}})
                res.json (user)
            }
            if(city) {
                const user = await User.findByIdAndUpdate (id, {$set: {city}})
                res.json (user)
            }
            if(work) {
                const user = await User.findByIdAndUpdate (id, {$set: {work}})
                res.json (user)
            }
            if(description) {
                const user = await User.findByIdAndUpdate (id, {$set: {description}})
                res.json (user)
            }
            // const {username, city, work, description } = req.body
            // const user = await User.findByIdAndUpdate(id, {$set: {username, city, work, description }})
            //            res.json(user)
        }catch (e) {
            next(e)
        }
    }

    async uploadImg(req, res, next){
        try{
            const {id} = req.params
            const {profilePicture} = req.files
            let imgFileName = uuid.v4 () + '.jpg'
            await profilePicture.mv (path.resolve (__dirname, '..', 'static', imgFileName))
            const user = await User.findByIdAndUpdate(id, {profilePicture: imgFileName})
            const result = await uploadImg(profilePicture, imgFileName)
            console.log(result)
            res.json({result, user})

        }catch (e) {
            next(e)
        }
    }
    async deleteOne(req, res, next){
        try{
            const {id} = req.params
            const user = await User.deleteOne({_id: id})
            res.json(user)
        }catch (e) {
            next(e)
        }
    }

    async follow(req, res, next){
        try{
            const {id} = req.params
            const user = await User.find({_id: id, followers: req.body.id})
            if (user.length > 0) {
                return res.status(500).json ({message: 'You followed this user.'})
            }
            const newUser = await User.findByIdAndUpdate({_id: id},
                 {$push: {followers: req.body.id}})
            await User.findByIdAndUpdate({_id: req.body.id},
                 {$push: {following: id}})
            res.json(newUser)
        }catch (e) {
            next(e)
        }
    }

    async unfollow(req, res, next){
        try{
            const {id} = req.params
            const newUser = await User.findByIdAndUpdate({_id: id},
                {$pull: {followers: req.body.id}})
            await User.findByIdAndUpdate({_id: req.body.id},
                {$pull: {following: id}})
            res.json({newUser})
        }catch (e) {
            next(e)
        }
    }

    async userFollowing(req, res, next){
        try{
            const {id} = req.params
            const user = await User.find({_id: id})
            const following = await Promise.all(
                user[0].following.map(id => {return User.findById(id)}))
            let followingList = []
            following.map(user =>{
                const {_id, username, profilePicture} = user
                followingList.push({_id, username, profilePicture})
            })
            res.json(followingList)
        }catch (e) {
            next(e)
        }
    }
    async userFollowers(req, res, next){
        try{
            const {id} = req.params
            const user = await User.find({_id: id})
            const followers = await Promise.all(
                user[0].followers.map(id => {return User.findById(id)}))
            let followingList = []
            followers.map(user =>{
                const {_id, username, profilePicture} = user
                followingList.push({_id, username, profilePicture})
            })
            res.json(followingList)
        }catch (e) {
            next(e)
        }
    }
    async checkFollow(req, res, next){
        try{
            const {id} = req.params
            const user = await User.find ({_id: req.body.userId })
                let bool = false
                if (user[0].following.includes (id)) {
                    bool = true
                }
                res.json (bool)

        }catch (e) {
            next(ApiError.BadRequest(e.message))
        }
    }

}

module.exports = new UserController()


