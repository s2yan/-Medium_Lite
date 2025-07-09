import Router from 'express'
import { createPost , getAllUserPosts, deletePost , updatePostDetails } from '../controllers/post.controllers.js'; 
import { jwtVerify } from '../middlewares/auth.middlewares.js';


const router = Router()
router.post('/addPost', jwtVerify, createPost)
router.get('/getAllUserPosts', jwtVerify, getAllUserPosts)
router.delete('/deletePost/:postId', jwtVerify, deletePost)
router.post('/updatePostDetails/:postId', jwtVerify, updatePostDetails )


export default router;
