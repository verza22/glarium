import { Router } from 'express';
import { CityController } from '../controllers/cityController';
import { authenticate } from "./../middleware/authMiddleware";

const router = Router();
const controller = new CityController();

router.post('/getInfo', authenticate, controller.getInfo.bind(controller));

export default router;