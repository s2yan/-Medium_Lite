import Router from 'express';
import { registerUser, loginUser } from '../controllers/user.controlers.js';
import { upload } from '../middlewares/muter.middlewares.js';

const router = Router();

router.post('/register', upload.single("profileImage"), registerUser);
router.post('/login', loginUser)

export default router;
