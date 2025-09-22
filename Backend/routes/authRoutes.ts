import express from 'express';
const router = express.Router();
import { Csignup, Clogin } from '../controllers/CustomerAuth.js';
import { Dsignup, Dlogin } from '../controllers/DealerAuth.js';

router.post('/customer/signup',Csignup);
router.post('/customer/login',Clogin);

router.post('/dealer/signup',Dsignup);
router.post('/dealer/login',Dlogin);

export default router;
