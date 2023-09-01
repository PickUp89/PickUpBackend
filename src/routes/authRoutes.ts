import express from 'express';
import { registerWithEmail, loginWithEmail } from '../controllers/auth';
import passport from '../controllers/passport';

const router = express.Router();

router.post('/register/email', registerWithEmail);
router.post('/login/email', loginWithEmail);

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