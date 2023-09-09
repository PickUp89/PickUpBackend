import express from 'express';
import { registerWithEmail, loginWithEmail } from '../controllers/auth';

import passport from '../controllers/passport';
import { logOutUser } from "../controllers/user";
import { withPermissions } from '../middleware/middleware';
import User from '../models/User';

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
  passport.authenticate('google'), 
    // @ts-ignore
    (req, res) => {
      // @ts-ignore
      if (req?.user) {
        // @ts-ignore
        const userId = req.user.id;
        res.redirect(`http://localhost:3000/user/${userId}`);
        res.status(200);
      } else {
        res.redirect(`http://localhost:3000/auth`);
        res.status(403);
      }
    });

export default router;