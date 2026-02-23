import { Router } from 'express';
import * as adminController from '../controllers/controllers.admin.js';
import * as authMiddleware from '../middlewares/middlewares.auth.js';
// import schema from '../schemas/schema.auth.js';
// import * as passwordController from '../controllers/controllers.password.js';
const router = Router();

router.post('/createAdmin',
    authMiddleware.verifyToken,
    //  models(schema.signUp, 'payload'),
     adminController.register);
router.post('/verifyAdmin', 
    // models(schema.verify, 'payload'), 
    adminController.verifyAdminAccount);
router.post('/adminLogin', 
    // models(schema.signIn, 'payload'), 
adminController.Adminlogin);

router.post('/adminstatusControl',
    authMiddleware.verifyToken,
    adminController.adminActivate
);
router.post('/suspendundreinstate',
    authMiddleware.verifyToken,
    adminController.suspendReinstateAdmin
);

export default router;
