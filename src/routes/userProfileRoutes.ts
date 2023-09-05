import express, { Router } from 'express';
import { getUserWithEmail, updatePassword, deleteAccount, updateUser } from "../controllers/user";
import { withPermissions } from '../middleware/middleware';

const router = express.Router();

// GET request to get one user's profile
// router.get('/get-user-profile/email', withPermissions(['View profile']), getUserWithEmail);
router.get('/get', getUserWithEmail);

// PATCH request to update any fields
router.patch('/update-password', withPermissions(["Update password"]), updatePassword);

router.patch('/update', updateUser);
// DELETE request to delete the user's account
router.delete('/delete', withPermissions(["Delete account"]), deleteAccount);


export default router;