import express from 'express';
import { registerWithEmail, loginWithEmail } from '../controllers/auth';
import { logOutUser } from "../controllers/user";
import { withPermissions } from '../middleware/middleware';

const router = express.Router();

// all the routes
// POST requests
router.post('/register', registerWithEmail); // registration flow
router.post('/login', loginWithEmail); // login with email
router.post('/logout', withPermissions(['View profile']), logOutUser);


export default router;