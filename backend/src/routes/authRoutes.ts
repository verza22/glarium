import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();
const controller = new AuthController();

router.post('/login', controller.login.bind(controller));
router.post('/register', controller.register.bind(controller));

export default router;