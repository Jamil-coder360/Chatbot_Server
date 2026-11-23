import { Router } from 'express'; 
// import { USER_ROLE } from '../users/user.constants.js';
import authController from './auth.controller.js';
import auth from '../../midleware/auth.js';
import { Role } from '@prisma/client';

const router:Router = Router();

router.post('/login', authController.login);

// router.post('/refresh-token', authController.refreshToken);


router.patch(
  "/change-password",
  auth(
    Role.SUPERADMIN,
    Role.SubADMIN,
    Role.ADMIN,
    Role.USER
  ),
  authController.changePassword
);


// router.patch('/forgot-password', authControllers.forgotPassword);
// router.patch('/reset-password', authControllers.resetPassword);

export const authRoutes = router;