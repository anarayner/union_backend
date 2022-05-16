const Router = require('express')
const router = new Router();
const ConversationController = require('../controllers/conversationController')
const MessageController = require('../controllers/messageController')



router.post('/conversation', ConversationController.create )
router.get('/conversations/:id', ConversationController.userConversations )
router.post('/message', MessageController.create )
router.post('/direct-message', MessageController.createDirect)
router.get('/messages/:id', MessageController.conversationMessages)



module.exports = router