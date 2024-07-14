import { Request, Response } from 'express';
import { prisma } from './dbsetup';

import { getIdParamSchema } from '../schemas/common.schema';
import {getPaginationParams} from './pagination';
import { Prisma } from '@prisma/client';

type IncludeOptions = {
  [key: string]: boolean | object;
};
const duration = parseInt(process.env.SCHEDULE_DURATION!)

const entityIdMap:any = {
  topic: 'topic_id',
  sheet: 'sheet_id',
  question: 'question_id',
  schedule: 'schedule_id',
  user: 'user_id',
  feedback:'feedback_id',
  solution:'solution_id'
};

const entityMap:any = {
  topic: prisma.topic,
  sheet: prisma.sheet,
  question: prisma.question,
  schedule: prisma.schedule,
  feedback: prisma.feedback,
  solution:prisma.solution,
  user:prisma.user
};
const relationMap:any = {
  question: prisma.topicQuestion,
  schedule: prisma.scheduleTopic, 
};
type Entity = 'question' | 'schedule' | string ;
type Relation = 'topic';


const prepareEntityData = (data: any, included: string[]) => {
  const entityData: any = { ...data };
  const includeData: any = {};
  
  for (const include of included) {
    if (data[include] && data[include].length > 0) {
      if (include === "topic") {
        includeData.topic = {
          create: data[include].map((topicId: string) => ({
            topic: { connect: { topic_id: topicId } },
          })),
        };
      }else if (include === 'image') {
        includeData[`${include}`] = {
          create: data[include].map((data: any) => ({
            image_url: data.url,
            image_type: data.type,
          })),
        };
      } 
      else {
        includeData[include] = {
          create: data[include].map((item: any) => item),
        };
      }
      delete entityData[include];
    }
  }
  
  return { entityData, includeData };
};

export const createIncludeEntity = async (req: Request, res: Response, entity: 'question' | 'schedule', included: string[]) => {
  try {
    const data = req.body;
    const { entityData, includeData } = prepareEntityData(data, included);

    console.log(entityData,includeData)
    
    const createdEntity = await entityMap[entity].create({
      data: {
        ...entityData,
        ...includeData,
      },
      include: included.reduce((acc, include) => {
        acc[`${include}`] = true;
        return acc;
      }, {} as Record<string, boolean>),
    });

    res.json({success:true,data: createdEntity});
  } catch (error:any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        // Foreign key constraint violation
        res.status(400).json({
          success:false,
          error: 'Foreign key constraint violation',
          message: `The provided ${error?.meta?.field_name} does not exist in the referenced table.`,
        });
      } else {
        // Other Prisma client errors
        res.status(500).json({
          success:false,
          error: 'Prisma client error',
          message: error.message,
        });
      }
    } else {
      // Other unexpected errors
      console.error('Error creating entity:', error);
      res.status(500).json({
        success:false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while creating the entity.',
      });
    }
  }
};

export const buildUpdateData = async(body:any) => {
    const updateData: any = {};

    for (const key in body) {
        if(body[key] !== null && body[key] !== undefined) {
            updateData[key] = body[key];
        }
    }

    return updateData;
};

export const getEntityByTitle = async (req: Request, res: Response, entity: 'topic' | 'sheet' | 'question') => {
  const { slug } = req.params;
  const {pageNumber,limitNumber} = getPaginationParams(req)

  let foundEntity;
  try {
    foundEntity = await entityMap[entity].findUnique({  // Change to findUnique after migration
      where: { slug }, // Convert to slug if needed
      include: entity === 'question' ? {
        topic:{
          select:{
            topic:{
              select:{
               title:true
             }
            }
          }
        },
        image:true
      } : {
        question: {
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
          
          select:{
            question:true
          }
        },
      },
    });
  } catch (error: any) {
    return res.status(404).json({success:false, error: error?.message });
  }

  if (!foundEntity) {
    return res.status(404).json({ success:false,error: `${entity.charAt(0).toUpperCase() + entity.slice(1)} not found` });
  }

  if (entity !== 'question' && foundEntity.questions) {
    const totalQuestions = await prisma.question.count({
      where: {
        [`${entity}_id`]: foundEntity[`${entity}_id`],
      },
    });

    return res.json({
      success:true,
      data: foundEntity,
      questions: foundEntity.questions,
      totalQuestions,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(totalQuestions / limitNumber),
    });
  }

  res.json({success:true,data:foundEntity});
};


export const getEntityById = async (req: Request,res: Response,entity: Entity,include: IncludeOptions = {}
,entityID?:string) => {
  try {
   
    let { id } =  req.params
    if(entityID) id = entityID;
    const foundEntity = await entityMap[entity].findUnique({
      where: { [entityIdMap[entity]]: id },
      include,
    });
    if(!entityID){
      if (!foundEntity) {
        return res.status(404).json({success:false, error: `${entity.charAt(0).toUpperCase() + entity.slice(1)} not found` });
      }
      res.json({success:true,data:foundEntity});
    }
    else {
      return foundEntity;
    }
  } catch (error: any) {
    if(!entityID)
      res.status(500).json({success:false, error: error.message });
    else return {error: error.message}
  }
};

const handleEntityOperation = async (req: Request, res: Response, entity: any, operation: 'create' | 'update' | 'delete') => {
  const {id} = req.params
  const entityId:any = entityIdMap[entity];
  let data, result;
  try {
    switch (operation) {
      case 'create':
        data = req.body;
        result = await entityMap[entity].create({ data });
        break;

      case 'update':
        
        const { topic, ...otherData } = req.body;
        const updateData = await buildUpdateData(otherData);
        if(topic){
          await handleRelationUpdate(entity, id,'topic',topic);
        }
        
        if(entity==='schedule'){
          // console.log(updateData)
          if(updateData){
            if(updateData.start_time){
              const start = updateData.start_time;
              const startDate = new Date(start*1000);
              if (!isPastTime(start, res)){
                let end = new Date(startDate.getTime() + duration * 60 * 1000);
                updateData.start_time = startDate.toISOString()
                const endDate = end.toISOString()
                const existSchedule = await getSchedule(startDate,endDate,req)
                if(existSchedule.length>0){
                  res.status(409).json({success:false,"status": "error","message": "Resource already exists",})
                  return;
                }
              }else return
            }

          }
        }
        // console.log("Came fo result")
        result = await entityMap[entity].update({
          where: { [entityId]: id },
          data: updateData,
          include:entity==='question' || entity==='schedule'?{
            topic:{
              select:{
                topic:{
                  select:{
                   title:true
                  }
                }
              }
            },
          }: undefined
        });

        break;

      case 'delete':
        result = await entityMap[entity].delete({
          where: { [entityId]: id },
        });
        res.status(204).send({success:true});
        return;
        
      break;
      default:
        throw new Error('Invalid operation');
    }
    if(result)
     res.json({success:true,data:result});
  } catch (error: any) {
    res.status(404).json({success:false, error: error.message });
  }
};

// to update the other table data like topics with question etc

export const handleRelationUpdate = async (entity: Entity,entityId: string,relation: Relation,newRelations: string[]) => {
  
  const entityIdField = entityIdMap[entity];

  await relationMap[entity].deleteMany({
    where: { [entityIdField]: entityId },
  });

  // await relationMap[entity].update({
  //   where: { [entityIdField]: entityId },
  //   data: {
  //     [relation]: {
  //       create: newRelations.map((relationId: string) => ({
  //         [relation]: { connect: { [`${relation}_id`]: relationId } },
  //       })),
  //     },
  //   },
  // });
  await Promise.all(newRelations.map(relationId => 
    relationMap[entity].create({
      data: {
        [entityIdField]: entityId,
        [`${relation}_id`]: relationId,
      },
    })
  ));
};

export const createEntity = async (req: Request, res: Response, entity: keyof typeof entityMap) => {
  await handleEntityOperation(req, res, entity, 'create');
};

export const updateEntity = async (req: Request, res: Response, entity: keyof typeof entityMap) => {
  await handleEntityOperation(req, res, entity, 'update');
};

export const deleteEntity = async (req: Request, res: Response, entity: keyof typeof entityMap) => {
  await handleEntityOperation(req, res, entity, 'delete');
};

export const isPastTime=  (startTime:any,res:Response)=>{
  const currentTime = Math.floor(Date.now() / 1000);
  if ( startTime< currentTime) {
    res.status(400).json({
      success:false,
      status: "error",
      message: "Invalid start time",
      error: {
        code: "INVALID_START_TIME",
        description: "The provided start time must be atleast 15min after than current time."
      }
    });
    return true;
  }
  return false;
}

export const getSchedule = async (start:any,end:any, req:Request)=>{
  return await prisma.schedule.findMany({
    where: {
      start_time:  {
        gte:start,
        lte:end
      },
      // owner_id:req?.payload?.user_id
    },
  });
}

export const getARandomProblem = async (
  topics:string[],
  users: string[],
  level: string
) => {
  const questions = await prisma.question.findMany({
    where: {
      topic: { some: { topic_id: { in: topics } } },
      difficulty_level: level,
      NOT: {
        solution: { some: { user_id: { in: users } } }
      }
    },
    include: {
      topic: true
    }
  });
  console.log("question",questions)
  const sortedQuestions = questions
    .map(question => ({
      ...question,
      matchingTopicsCount: question.topic.filter(t => topics.includes(t.topic_id)).length
    }))
    .sort((a, b) => b.matchingTopicsCount - a.matchingTopicsCount);

    console.log("sorted",sortedQuestions)

    const topN = 10;
    const randomIndex = Math.floor(Math.random() * Math.min(topN, sortedQuestions.length));
    console.log("index", randomIndex)
    return sortedQuestions[randomIndex];
  }
// export const createEntity = async (req: Request, res: Response, entity: 'topic' | 'sheet' | 'question' | 'schedule') => {
//   const data = req.body;

//   const entityMap = {
//     topic: prisma.topic,
//     sheet: prisma.sheet,
//     question: prisma.question,
//     schedule: prisma.schedule,
//   };

//   const createdEntity = await entityMap[entity].create({
//     data,
//   });

//   res.json(createdEntity);
// };

// interface UpdateData {
//     [key: string]: any;
//   }
  
// export const updateEntity = async (req: Request, res: Response, entity: 'topic' | 'sheet' | 'question' | 'schedule') => {
//     const { id } = getIdParamSchema.parse(req.params);
//     const updateData = buildUpdateData(req.body);
  
//     const entityMap = {
//       topic: 'topic_id',
//       sheet: 'sheet_id',
//       question:'question_id',
//       schedule: 'schedule_id',
//       user:"user"
//     };
  
//     const entityId = entityMap[entity];
//     let updatedEntity;
//     try{
//       updatedEntity = await prisma[entity].update({
//         where: { [entityId]: id },
//         data: updateData,
//       });

//     }catch(error:any){
//       res.status(404).json(error?.message)
//     }
  
//     res.json(updatedEntity);
//   };



//   export const deleteEntity = async (req: Request, res: Response, entity: 'topic' | 'sheet' | 'question' | 'schedule' | 'user') => {
//     const { id } = getIdParamSchema.parse(req.params);
  
//     const entityMap = {
//       topic: 'topic_id',
//       sheet: 'sheet_id',
//       question: 'question_id',
//       schedule: 'schedule_id',
//       user:'user_id'
//     };
  
//     const entityId = entityMap[entity];
    
//     try{
//       await prisma[entity].delete({
//         where: { [entityId]: id },
//       });

//     }catch(error:any){
//       res.status(404).json(error?.message)
//     }
  
//     res.status(204).send();
//   };


  // export const getEntityByTitle = async (req: Request, res: Response, entity: 'topic' | 'sheet' | 'question') => {
//   const { title } = req.params;

//   const entityMap = {
//     topic: prisma.topic,
//     sheet: prisma.sheet,
//     question: prisma.question,
//   };
//   let foundEntity;
//   try {
//     foundEntity = await entityMap[entity].findMany({  // change it to unique after migration again
//       where: { title }, // convert into slug
//     });
    
//   } catch (error:any) {
//     res.status(404).json(error?.message)
//   }

//   if (!foundEntity) {
//     return res.status(404).json({ error: `${entity.charAt(0).toUpperCase() + entity.slice(1)} not found` });
//   }

//   res.json(foundEntity);
// };