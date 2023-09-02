import express from 'express';
import { registerWithEmail, loginWithEmail, googleRegister } from '../controllers/auth';

const router = express.Router();

// all the routes
// POST requests
router.post('/register/email', registerWithEmail); // registration flow
router.post('/login/email', loginWithEmail); // login with email
router.post('/register/google', googleRegister); // login with third-party


export default router;