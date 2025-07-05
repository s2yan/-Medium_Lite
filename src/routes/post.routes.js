import Router from 'express'
import { createPost } from '../controllers/post.controllers.js'; 
import { jwtVerify } from '../middlewares/auth.middlewares.js';


const router = Router()
router.post('/addPost', jwtVerify, createPost)

export default router;
