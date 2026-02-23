import { Router } from 'express';
import * as userStatusController from '../controllers/controllers.users.js';
import * as authMiddleware from '../middlewares/middlewares.auth.js';
const router = Router();

router.post('/userstatusControl',
    authMiddleware.verifyToken,
    userStatusController.userActivate
);
router.post('/suspendundreinstate',
    authMiddleware.verifyToken,
    userStatusController.suspendReinstateUser
);
export default router;