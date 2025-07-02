import Router from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/user.controlers.js';
import { upload } from '../middlewares/muter.middlewares.js';
import { jwtVerify } from '../middlewares/auth.middlewares.js';

const router = Router();

router.post('/register', upload.single("profileImage"), registerUser);
router.post('/login', loginUser)
router.post('/logout', jwtVerify, logoutUser)

export default router;
