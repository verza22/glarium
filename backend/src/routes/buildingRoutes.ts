import { Router } from 'express';
import { BuildingController } from '../controllers/buildingController';
import { authenticate } from "./../middleware/authMiddleware";

const router = Router();
const controller = new BuildingController();

router.post('/getInfo', authenticate, controller.getInfo.bind(controller));
router.post('/available', authenticate, controller.available.bind(controller));

export default router;