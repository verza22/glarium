import { Router } from 'express';
import { WorldController } from '../controllers/worldController';
import { authenticate } from "./../middleware/authMiddleware";

const router = Router();
const controller = new WorldController();

router.post('/getIslands', authenticate, controller.getIslands.bind(controller));

export default router;