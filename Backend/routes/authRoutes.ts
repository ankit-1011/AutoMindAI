import express from 'express';
const router = express.Router();
import { Csignup, Clogin } from '../controllers/CustomerAuth.js';
import { Dsignup, Dlogin } from '../controllers/DealerAuth.js';
import { Slogin, Ssignup } from '../controllers/ServiceAuth.js';

router.post('/customer/signup',Csignup);
router.post('/customer/login',Clogin);

router.post('/dealer/signup',Dsignup);
router.post('/dealer/login',Dlogin);

router.post('/dealer/signup',Ssignup);
router.post('/dealer/login',Slogin);

export default router;
