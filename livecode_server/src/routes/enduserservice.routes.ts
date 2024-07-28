import { Router } from 'express';
import { createSchedule, updateSchedule, deleteSchedule, getScheduleById,getSheduleByTime, getScheduleOfUser, createFeedbackForm, getFeedbackOfUser,   } from '../controllers/enduserservice.controllers';
import { authMiddleware } from '../middlewares/auth.middlewares';
import { validateUpdateScheduleSchema,validateScheduleSchema,validParams, validateDateTimeSchema, validateFeedbackSchema } from '../middlewares/validation.middleware'

const router = Router();

//SCHEDULE
router.post('/schedule', authMiddleware, validateScheduleSchema, createSchedule);
router.put('/schedule/:id', authMiddleware, validateUpdateScheduleSchema, updateSchedule);
router.delete('/schedule/:id', authMiddleware,validParams, deleteSchedule);
router.get('/schedule/:id', authMiddleware,validParams, getScheduleById);
router.get('/schedules',authMiddleware,validParams, getScheduleOfUser)
router.get('/schedule-by-dt',authMiddleware,validateDateTimeSchema,getSheduleByTime)

//FEEDBACK
router.post('/feedback',authMiddleware,validateFeedbackSchema,createFeedbackForm)
router.get('/feedback',authMiddleware,getFeedbackOfUser)
// get feedback of a schedule?
export default router;
