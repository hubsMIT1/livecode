import { PrismaClient } from '@prisma/client';
import { Request,Response } from 'express';

const prisma = new PrismaClient();

export const paginate = async (req: Request,model: any,res:Response,where?:object,include?:object) => {
  const { pageNumber, limitNumber } = getPaginationParams(req);

  const skip = (pageNumber - 1) * limitNumber;
  try{
    const queryOptions: any = {
      skip,
      take: limitNumber,
      
    };

    if (where) {
      queryOptions.where = where;
    }
    if(include){
      queryOptions.include = include
    }
    const [data, total] = await prisma.$transaction([
      model.findMany(queryOptions),
      model.count(),
    ]);
    
    const result = {
      data,
      total,
      pageNumber,
      limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
    res.json(result);
  }catch(error:any){
    res.status(401).json(error?.message)
  }
};

export const getPaginationParams = (req: Request) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  return { pageNumber, limitNumber };
};
