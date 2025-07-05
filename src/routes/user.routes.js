import Router from 'express';
import { registerUser, loginUser, logoutUser, deleteProfileImage, updateProfileDetails, getUser } from '../controllers/user.controlers.js';
import { upload } from '../middlewares/muter.middlewares.js';
import { jwtVerify } from '../middlewares/auth.middlewares.js';

const router = Router();

router.post('/register', upload.single("profileImage"), registerUser);
router.post('/login', loginUser)
router.post('/logout', jwtVerify, logoutUser)
router.post('/deleteProfileImage', jwtVerify, deleteProfileImage )
//ToDo: Add the remaining user routes
router.post('/updateProfileDetails', jwtVerify, updateProfileDetails)
router.get('/getUser', jwtVerify, getUser)

export default router;
