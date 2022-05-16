const ApiError = require('../errors/apiError')
const Message = require ('../models/Message');
const Conversation = require ('../models/Conversation');

class MessageController{

    async create(req, res, next){
        try{
            const {conversationId, sender, content} = req.body
            const message = await Message.create ({conversationId, sender, content})
            const messages  = await Message.find({conversationId: conversationId}).populate('sender', 'username profilePicture')
            return res.json(messages)

        }catch (e) {
            next(ApiError.BadRequest(e.message))
        }
    }
    async createDirect(req, res, next){
        try{
            const {receiverId, sender, content} = req.body
            console.log(receiverId, sender, content)
            let conversationId
            const conversationsExist  = await Conversation.find({members: [sender,receiverId]})
            const conversationsExist2  = await Conversation.find({members: [receiverId, sender]})
            if(!conversationsExist[0]){
                console.log('work')
                conversationId = conversationsExist2[0]._id
            } else {
                conversationId = conversationsExist[0]._id
            }
            const message = await Message.create ({conversationId, sender, content})
            return res.json(message)
        }catch (e) {
            next(ApiError.BadRequest(e.message))
        }
    }

    async conversationMessages (req, res, next){
        try{
            const {id} = req.params
            const messages  = await Message.find({conversationId: id}).populate('sender', 'username profilePicture')
            return res.json(messages)

        }catch (e) {
            next(ApiError.BadRequest(e.message))
        }
    }


}

module.exports = new MessageController()