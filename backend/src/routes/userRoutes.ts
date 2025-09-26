import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();
const controller = new UserController();

router.get('/config', controller.config.bind(controller));

export default router;