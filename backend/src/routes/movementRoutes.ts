import { Router } from 'express';
import { MovementController } from '../controllers/movementController';
import { authenticate } from "./../middleware/authMiddleware";

const router = Router();
const controller = new MovementController();

router.get('/getMovements', authenticate, controller.getMovements.bind(controller));
router.post('/colonize', authenticate, controller.colonize.bind(controller));
router.post('/transport', authenticate, controller.transport.bind(controller));
router.post('/removeMovement', authenticate, controller.removeMovement.bind(controller));

export default router;