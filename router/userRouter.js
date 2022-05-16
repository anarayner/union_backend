const Router = require('express')
const router = new Router();
const UserController = require('../controllers/userController')
const authMiddleware = require ('../middleware/authMiddleware');

router.get('/:id', UserController.getOne )
router.get('/',  UserController.getUsers )
router.put('/:id', UserController.updateOne )
router.put('/img/:id', UserController.uploadImg )
router.delete('/:id', UserController.deleteOne )
router.patch('/follow/:id', UserController.follow)
router.patch('/unfollow/:id', UserController.unfollow)
router.get('/following/:id',  UserController.userFollowing)
router.get('/followers/:id',  UserController.userFollowers)
router.post('/follow/check/:id', UserController.checkFollow )
router.get('/image/:key', UserController.image);

module.exports = router

