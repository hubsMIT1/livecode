import { Request, Response } from 'express';
import { prisma } from '../utils/dbsetup';
import { paginate } from '../utils/pagination';
import {updateEntity,deleteEntity, createIncludeEntity, getEntityById, createEntity} from '../utils/helper'
// import { dateTimeCheck } from '../middlewares/validation.middleware';
// import { queryTimeSchema } from '../schemas/common.schema';
import { getSchedule,isPastTime } from '../utils/helper';
const duration = parseInt(process.env.SCHEDULE_DURATION!)

export const createSchedule = async(req: any, res: Response) =>{
    // console.log(req.body)
    req.body={...req.body,"owner_id":req.payload.user_id, allowed_users:[req.payload.username]};
    // let start
    const start = req.body.start_time;
    let startDate = new Date(start*1000);
    if (!isPastTime(start, res)) {
   
      const endDate = new Date(startDate.getTime() + duration * 60 * 1000);
      req.body.start_time = startDate.toISOString()
      endDate.toISOString()
      const existSchedule = await getSchedule(startDate,endDate,req)
      if(existSchedule.length>0){
        res.status(409).json({success:false,"status": "error","message": "Resource already exists",})
        
      }
      else await createIncludeEntity(req, res, 'schedule',['topic'])
    }

};
export const createFeedbackForm = async(req:any,res:Response)=> await createEntity(req,res,'feedback');

export const createSolution = async (req:any,res:Response) => {
  req.body = {...req.body,"user_id":req?.payload?.user_id};
  await createEntity(req,res,'solution')
}

export const updateSchedule = async(req:Request,res:Response)=> await updateEntity(req,res,'schedule')
export const updateSolution = async(req:Request,res:Response)=> await updateEntity(req,res,'solution')


export const deleteSchedule = async (req: Request, res: Response) => await deleteEntity(req, res, 'schedule');
export const deleteSolution = async (req: Request, res: Response) => await deleteEntity(req, res, 'solution');

const include = {
    topic: {
      select: {
        topic: {
          select: {
            title: true,
            topic_id:true
          },
        },
      },
    },
};
// add feedback, question also

const topicSelect = {
  topic: {
    select: {
      topic: {
        select: {
          title: true,
        }
      }
    }
  }
}
const selectTopic = {
  schedule_id: true,
  level: true,
  join_link: true,
  start_time: true,
  created_at: true,
  owner_id: true,
  allowed_users: true,
  status: true,
  end_time: true,
  question_id: true,
  topic: {
    select: {
      topic: {
        select: {
          title: true,
          topic_id:true,
        }
      }
    }
  }
};
export const getScheduleById = async(req:Request,res:Response)=> await getEntityById(req,res,'schedule',include);
export const getScheduleOfUser = async(req:any,res:Response) => await paginate({
  req,
  model: prisma.schedule,
  res,
  where: { owner_id: req.payload.user_id },
  select:selectTopic
})

export const getSheduleByTime = async (req:Request,res:Response)=>{
  const {start,end} = req.query
  try {
    const schedules = await getSchedule(start,end,req);
    res.json({success:true,data:schedules});
  } catch (error: any) {
    res.status(500).json({success:false, error: error.message });
  }
}

const includeQS = {
  question: {
    select: {
      question: {
        select: {
          title: true,
          include
        },
      },
    },
  },
};

export const getFeedbackOfUser = async(req:any,res:Response)=> await paginate({req,model:prisma.feedback,res,where: {interviewee:req.payload.user_id}})
export const getFeedbackBySchedule = async(req:any,res:Response)=> await paginate({req,model:prisma.feedback,res,where:{interviewee:req.payload.user_id}})
export const getSolutionOfUser = async(req:any,res:Response)=> await paginate({req,model:prisma.solution,res,where:{user_id:req.payload.user_id}})
export const getSolutionOfQuestion = async(req:Request,res:Response)=> await paginate({req,model:prisma.solution,res,where:{question_id:req.params.id},include:includeQS})


// export const createSchedule = async (req: Request, res: Response) => {
//     try {
//       await createScheduleSchema.parseAsync(req.body);
//       await createEntity(req, res, 'schedule');
//     } catch (error: any) {
//       return res.status(400).json({ error: 'Invalid input', details: error.errors });
//     }
//   };
  
//   export const reschedule = async (req: Request, res: Response) => {
//     try {
//       await rescheduleSchema.parseAsync(req.body);
//       await updateEntity(req, res, 'schedule');
//     } catch (error: any) {
//       return res.status(400).json({ error: 'Invalid input', details: error.errors });
//     }
//   };
  
// export const getSchedules = async (req: Request, res: Response) => await getEntity(req, res, 'schedule');
  
  