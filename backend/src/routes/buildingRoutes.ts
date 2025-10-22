import { Router } from 'express';
import { BuildingController } from '../controllers/buildingController';
import { authenticate } from "./../middleware/authMiddleware";

const router = Router();
const controller = new BuildingController();

router.post('/getInfo', authenticate, controller.getInfo.bind(controller));
router.post('/available', authenticate, controller.available.bind(controller));
router.post('/create', authenticate, controller.create.bind(controller));
router.post('/nextLevel', authenticate, controller.nextLevel.bind(controller));
router.post('/upgrade', authenticate, controller.upgrade.bind(controller));

export default router;