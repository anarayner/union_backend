require('dotenv').config()
const ApiError = require('../errors/apiError')
const Conversation = require('../models/Conversation')

class ConversationController{
    async create(req, res, next){
        try{
            const {id, receiverId} = req.body
            console.log(id, receiverId)
            const conversationsExist  = await Conversation.find({members: [id,receiverId]})
            const conversationsExist2  = await Conversation.find({members: [receiverId, id]})

            if(!conversationsExist[0] && !conversationsExist2[0]) {
                const conversation = new Conversation ({members: [id, receiverId]})
                await conversation.save ()
                return res.json({conversation})
            }
            return res.json({message: 'Conversation already exist'})

        }catch (e) {

            next(ApiError.BadRequest(e.message))
        }
    }

    async userConversations (req, res, next){
        try{
            const {id} = req.params
            const conversations  = await Conversation.find({members: id}).sort('-updatedAt').populate('members', 'username profilePicture')
            return res.json(conversations)

        }catch (e) {
            next(ApiError.BadRequest(e.message))
        }
    }


}

module.exports = new ConversationController()