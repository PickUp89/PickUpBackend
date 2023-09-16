import express from 'express';
import { getPostById, getPostByUserId, createNewPost, deletePost, updatePost, getPostByLocation, attendPost, savedPosts } from "../controllers/post";

const router = express.Router();

router.post('/create', createNewPost );
router.get('/getPostByUserId', getPostByUserId);
router.get('/getPostByLocation', getPostByLocation);
router.get('/getPostById', getPostById);
router.delete('/delete', deletePost);
router.patch('/update', updatePost);
router.patch('/update/attendingEvents', attendPost);
router.patch('/update/savedEvents', savedPosts);

export default router;