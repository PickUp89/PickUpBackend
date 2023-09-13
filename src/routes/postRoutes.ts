import express from 'express';
import { getPostById, getPostByUserId, createNewPost} from "../controllers/post";

const router = express.Router();

router.post('/create', createNewPost );
router.get('/getPostByUserId', getPostByUserId);
router.get('/getPostById', getPostById);

export default router;