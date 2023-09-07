import express from 'express';
import { registerWithEmail, loginWithEmail } from '../controllers/auth';

import passport from '../controllers/passport';
import { logOutUser } from "../controllers/user";
import { withPermissions } from '../middleware/middleware';

const router = express.Router();

// all the routes
// POST requests
router.post('/register/email', registerWithEmail);
router.post('/login/email', loginWithEmail);
router.post('/register', registerWithEmail); // registration flow
router.post('/login', loginWithEmail); // login with email
router.post('/logout', withPermissions(['View profile']), logOutUser);


// Auth With Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));
router.get('/google/callback', 
  passport.authenticate('google', {
    successRedirect: '/success', // TODO: change this after config frontend
    failureRedirect: '/fail', // TODO: change this after config frontend
  }));

export default router;