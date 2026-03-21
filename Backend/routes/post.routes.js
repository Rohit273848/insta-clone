const express = require('express')
const postRouter = express.Router();
const postController = require('../controllers/post.controller');
const multer = require('multer')
const identifyuser = require('../middlewares/auth.middleware.js')


const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * POST /api/posts/ [protected]
 * req.body [caption,image-file]
 */
postRouter.post("/", upload.single("image"),identifyuser, postController.createPostController);


// postRouter.post('/',postController.createPostController)
/**
 * GET /api/posts [protected]
 */
postRouter.get("/",identifyuser,postController.getPostController);


/**
 * @routes GET  /api/posts/details/:postId
 * @description return the details about a specific post with the id . also check whether the post belongs to the user that the require come from 
 */
postRouter.get('/detail/:postId',identifyuser,postController.getPostDetailController)

/**
 * @routes POST /api/posts/like/:postId
 * @description like a post with username that provided in request params.
 */
postRouter.post('/like/:postId',identifyuser,postController.likePostController)


module.exports=postRouter;