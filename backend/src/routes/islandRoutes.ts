import { Router } from 'express';
import { IslandController } from '../controllers/islandController';
import { authenticate } from "./../middleware/authMiddleware";

const router = Router();
const controller = new IslandController();

router.post('/getInfo', authenticate, controller.getInfo.bind(controller));

export default router;