import express from 'express';
import { getPostById, getPostByUserId, createNewPost, deletePost, updatePost} from "../controllers/post";

const router = express.Router();

router.post('/create', createNewPost );
router.get('/getPostByUserId', getPostByUserId);
router.get('/getPostById', getPostById);
router.delete('/delete', deletePost);
router.patch('/update', updatePost);

export default router;