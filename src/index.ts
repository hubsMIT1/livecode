// import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes';
import tsq_server from './routes/topic_sheet_ques.routes'
import endUserServer from './routes/enduserservice.routes'
import express, { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';



const app = express();

app.use(express.json());
app.use(cookieParser());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid input',
      errors: err.errors,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.use('/api/users', userRoutes);
app.use('/api/service', tsq_server);
app.use('/api/end-user-service', endUserServer);


app.listen(3001, () => {
  console.log('server is running on port http://localhost:3001');
});