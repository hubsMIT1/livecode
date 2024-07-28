import { Prisma } from "@prisma/client";
import { Response } from "express";
export const DataBaseConnectionError = (err:any,res:Response)=>{
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P1001') {
          console.error('Database connection error:', err);
          return res.status(503).json({
            status: 'error',
            message: 'Database is currently unavailable. Please try again later.',
          });
        }
      }
}