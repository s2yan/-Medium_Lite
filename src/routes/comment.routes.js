import Router from 'express';
import { addComment , deleteComment, updateComment , getUserComments } from '../controllers/comment.controllers.js';
import { jwtVerify } from '../middlewares/auth.middlewares.js';


const router = Router();

router.post('/addComment/:postId', jwtVerify, addComment)
router.patch('/updateComment/:commentId', updateComment)
router.delete('/deleteComment/:commentId', deleteComment)
router.get('/user', jwtVerify, getUserComments)

export default router;

