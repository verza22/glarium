import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from "./../middleware/authMiddleware";

const router = Router();
const controller = new UserController();

router.get('/config', authenticate, controller.config.bind(controller));
router.post('/buyTradeShip', authenticate, controller.buyTradeShip.bind(controller));
router.post('/getMayor', authenticate, controller.getMayor.bind(controller));
router.post('/getMessages', authenticate, controller.getMessages.bind(controller));
router.post('/sendMessage', authenticate, controller.sendMessage.bind(controller));
router.post('/readMessage', authenticate, controller.readMessage.bind(controller));
router.post('/unreadOrReadAll', authenticate, controller.unreadOrReadAll.bind(controller));
router.post('/deleteMessages', authenticate, controller.deleteMessages.bind(controller));

export default router;