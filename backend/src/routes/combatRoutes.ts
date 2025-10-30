import { Router } from 'express';
import { CombatController } from '../controllers/combatController';
import { authenticate } from "./../middleware/authMiddleware";

const router = Router();
const controller = new CombatController();

router.post('/combatMovement', authenticate, controller.combatMovement.bind(controller));

export default router;