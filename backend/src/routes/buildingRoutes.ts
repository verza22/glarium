import { Router } from 'express';
import { BuildingController } from '../controllers/buildingController';
import { authenticate } from "./../middleware/authMiddleware";

const router = Router();
const controller = new BuildingController();

router.post('/buildings', authenticate, controller.buildings.bind(controller));

export default router;