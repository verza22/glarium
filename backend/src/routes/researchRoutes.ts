import { Router } from 'express';
import { ResearchController } from '../controllers/researchController';
import { authenticate } from "./../middleware/authMiddleware";

const router = Router();
const controller = new ResearchController();

router.post('/getResearchData', authenticate, controller.getResearchData.bind(controller));
router.post('/create', authenticate, controller.create.bind(controller));

export default router;