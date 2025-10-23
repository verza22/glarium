import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from "./../middleware/authMiddleware";

const router = Router();
const controller = new UserController();

router.get('/config', authenticate, controller.config.bind(controller));
router.post('/buyTradeShip', authenticate, controller.buyTradeShip.bind(controller));

export default router;