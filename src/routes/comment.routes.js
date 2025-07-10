import Router from 'express';
import { addComment } from '../controllers/comment.controllers';
import { jwtVerify } from '../middlewares/auth.middlewares.js';


const router = Router();

router.post('/addComment', jwtVerify, addComment)

export default router;

