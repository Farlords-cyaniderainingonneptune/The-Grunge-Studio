import { Router } from 'express';
import * as authController from '../controllers/controllers.auth.js';
// import models from '../middlewares/models.js';
// import schema from '../schema/schema.auth.js';
import * as passwordController from '../controllers/controllers.password.js';
const router = Router();

router.post('/register',
    //  models(schema.signUp, 'payload'),
     authController.register);
router.post('/verify-account', 
    // models(schema.verify, 'payload'), 
    authController.verifyAccount);
router.post('/resend-verification-code',
    //  models(schema.resendVerification, 'payload'),
      authController.resendVerificationCode);
router.post('/login', 
    // models(schema.signIn, 'payload'), 
authController.login);
router.post('/forgot-password', 
    passwordController.forgotPassword);

router.patch('/reset-password', 
    passwordController.resetPassword);

export default router;