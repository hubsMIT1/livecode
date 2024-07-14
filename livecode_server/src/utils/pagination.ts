import { PrismaClient } from '@prisma/client';
import { Request,Response } from 'express';

const prisma = new PrismaClient();


interface PaginateOptions {
  req: Request;
  model: any;
  res: Response;
  where?: object;
  include?: object;
  select?: object;
}

export const paginate = async ({ req, model, res, where, include, select }: PaginateOptions) => {
  const { pageNumber, limitNumber } = getPaginationParams(req);
  if (isNaN(pageNumber) || isNaN(limitNumber)) {
    return res.status(400).json({ success: false, error: "Invalid page or limit parameters" });
  }
  const skip = (pageNumber - 1) * limitNumber;
  try{
    const queryOptions: any = {
      skip,
      take: limitNumber,
      
    };

    if (where) {
      console.log(where)
      queryOptions.where = where;
    }
    if(include){
      console.log(include)
      queryOptions.include = include
    }
    if (select) {
      queryOptions.select = select;
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
    console.log("schedule data",data)
    res.json({success:true,data:result});
  }catch(error:any){
    res.status(401).json({success:false,error:error?.message})
  }
};

export const getPaginationParams = (req: Request) => {
  const { page = '1', limit = '10' } = req.query;
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  return { pageNumber, limitNumber };
};
