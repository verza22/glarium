import { Router } from 'express';
import { CityController } from '../controllers/cityController';
import { authenticate } from "./../middleware/authMiddleware";

const router = Router();
const controller = new CityController();

router.post('/getInfo', authenticate, controller.getInfo.bind(controller));
router.post('/setWine', authenticate, controller.setWine.bind(controller));
router.post('/setScientists', authenticate, controller.setScientists.bind(controller));

export default router;