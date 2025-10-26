import { Router } from 'express';
import { IslandController } from '../controllers/islandController';
import { authenticate } from "./../middleware/authMiddleware";

const router = Router();
const controller = new IslandController();

router.post('/getInfo', authenticate, controller.getInfo.bind(controller));
router.post('/getData', authenticate, controller.getData.bind(controller));
router.post('/setWorker', authenticate, controller.setWorker.bind(controller));
router.post('/setDonation', authenticate, controller.setDonation.bind(controller));

export default router;