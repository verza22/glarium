import { Router } from 'express';
import { UnitController } from '../controllers/unitController';
import { authenticate } from "./../middleware/authMiddleware";

const router = Router();
const controller = new UnitController();

router.post('/create', authenticate, controller.create.bind(controller));
router.post('/city', authenticate, controller.city.bind(controller));

export default router;