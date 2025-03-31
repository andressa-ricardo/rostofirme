import { Router } from 'express';
import {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} from '../../controllers/activity/activity.controller';

const router = Router();

router.post('/send', createActivity);
router.get('/', getActivities);
router.get('/:id', getActivityById);
router.put('/edit/:id', updateActivity);
router.delete('/delete/:id', deleteActivity);

export default router;