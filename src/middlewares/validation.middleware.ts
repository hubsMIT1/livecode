import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { createTopicSchema, createSheetSchema, createQuestionSchema,updateQuestionSchema,updateSheetSchema,updateTopicSchema,addQuestionsToSheetSchema,  } from '../schemas/topic_sheet_ques.schema';
import { createFeedbackSchema, createScheduleSchema, updateScheduleSchema } from '../schemas/enduserservice.schema';
import { getIdParamSchema,queryTimeSchema } from '../schemas/common.schema';

const validateSchema = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    if (Object.keys(req.body).length > 0) {
      req.body = await schema.parseAsync(req.body);
    }
    if (Object.keys(req.params).length > 0) {
      req.params = await getIdParamSchema.parseAsync(req.params);
    }
    if (Object.keys(req.query).length > 0) {
      req.query = await schema.parseAsync(req.query);
    }
    
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid input',
        errors: error.errors,
      });
    } else {
      next(error);
    }
  }
};
export const validParams = async(req: Request, res: Response, next: NextFunction) =>{
  try {
    if(req.params && req.params.length>0){
      req.params = await getIdParamSchema.parseAsync(req.params);
    }
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid params',
        errors: error.errors,
      });
    } else {
      next(error);
    }
  }
}
export const validateScheduleSchema = validateSchema(createScheduleSchema);
export const validateUpdateScheduleSchema = validateSchema(updateScheduleSchema);


export const validateDateTimeSchema = validateSchema(queryTimeSchema)
export const validateTopicSchema = validateSchema(createTopicSchema);
export const validateSheetSchema = validateSchema(createSheetSchema);
export const validateQuestionSchema = validateSchema(createQuestionSchema);
export const validateUpdateTopicSchema = validateSchema(updateTopicSchema);
export const validateUpdateSheetSchema = validateSchema(updateSheetSchema);
export const validateUpdateQuestionSchema = validateSchema(updateQuestionSchema);
export const validateQuestionsToSheetSchema = validateSchema(addQuestionsToSheetSchema);
export const validateFeedbackSchema = validateSchema(createFeedbackSchema)


// export const dateTimeCheck =(dt,res:Response)=>{
//     let start,end;
//     try{
//         if(dateSchema.safeParse(dt.start).success && dateSchema.safeParse(dt.end).success){
//             start = new Date(dt.start);
//             end = new Date(dt.end);
//         }
//         else if(dateTimeSchema.safeParse(dt.start).success && dateTimeSchema.safeParse(dt.start).success){
//             start = new Date(dt.start);
//             end = new Date(dt.end)
//         }
//     }catch(error:any){
//         res.status(400).json({
//           status: 'error',
//           message: 'Invalid Date-Time',
//           errors: error.message,
//         });
        
//     }
//     return {start,end}
// }
