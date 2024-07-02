import express, {Response,Request,NextFunction} from 'express';
import { ZodError } from 'zod';
import { createUser, loginUser, refreshToken, updateUser,profileData} from '../controllers/user.controllers';
import { createUserSchema, loginUserSchema, updateUserSchema } from '../schemas/user.schema';
import { authMiddleware } from '../middlewares/auth.middlewares';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createUserSchema.parseAsync(req.body);
    await createUser(req, res);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid input',
        errors: error.errors
      });
    }
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body);
    const user = await loginUserSchema.parseAsync(req.body);
    await loginUser(req, res);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid input',
        errors: error.errors
      });
    }
    next(error);
  }
});

  //patch
  router.put('/:userId', async (req:Request, res:Response, next:NextFunction) => {
    try {
      const user = await updateUserSchema.parseAsync(req.body);
      await updateUser(req, res);
    } catch (error) {
      next(error);
    }
  })

  router.post('/refresh_token', refreshToken);
  router.get('/:username', authMiddleware, profileData);
  
  // router.post('/signup', createUserSchema.parseAsync(createUser));
  // router.post('/login', loginUserSchema.parseAsync(loginUser));
  // router.put('/:userId', authMiddleware, updateUserSchema.parseAsync(updateUser));

export default router;