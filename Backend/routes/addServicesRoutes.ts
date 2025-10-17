import express from 'express';
const router = express.Router();
import { addServices } from '../controllers/VehicleServices';


router.post('/',addServices)

export default router;