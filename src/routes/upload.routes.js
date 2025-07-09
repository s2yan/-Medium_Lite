import Router from 'express';
import { upload } from '../middlewares/muter.middlewares.js';
import { uploadPostController } from '../controllers/uplaodPostController.js';

const router = Router()
router.post('/upload', 
    upload.fields([
	{ name: "image" },
	{ name: "video" }
	],
    uploadPostController
	))

export default router;
