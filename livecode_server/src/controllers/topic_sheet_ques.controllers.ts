import { NextFunction, Request, Response } from 'express';
import { prisma } from '../utils/dbsetup';
import { paginate } from '../utils/pagination';
import {updateEntity, getEntityByTitle,deleteEntity,createEntity, createIncludeEntity, getEntityById, getARandomProblem} from '../utils/helper'
import { updateRoom } from './helperFuctions/endservices';

export const createTopic = async(req: Request, res: Response) => await createEntity(req, res, 'topic');
export const createSheet = async(req: Request, res: Response) => await createEntity(req, res, 'sheet');

export const createQuestion = async (req: Request, res: Response) => {
  await createIncludeEntity(req, res, 'question', ['topic']);
};

// create(done), update(?), delete(?)
export const addQuestionsToSheet = async (req: Request, res: Response) => {
  const { questions } = req.body;
  const { id } = req.params;
  try{
    const data = questions.map((question_id: string) => ({
      sheet_id: id,
      question_id,
    }));
  
    const sheetQuestions = await prisma.sheetQuestion.createMany({
      data,
      skipDuplicates: true, // Prevents duplicates in case they already exist
    });

    res.status(201).json({success:true, message: 'Questions added to sheet', count: sheetQuestions.count });
  }catch(error:any){
    res.status(401).json({success:true,error:error?.message})
  }
};

/***                           GET LIST OF Topic, Sheet, Question                                */
const includeQuesTopic = {
  topic: {
    select: {
      topic: {
        select: {
          title: true,
        },
      },
    },
  },
}
export const getAllTopics = async (req: Request, res: Response) => await paginate({req,model:prisma.topic, res});
export const getAllSheets = async (req: Request, res: Response) => await paginate({req, model:prisma.sheet, res});
export const getAllQuestions = async (req: Request, res: Response) => await paginate({req, model:prisma.question, res,include: includeQuesTopic});

/****         GET BY TITLE OR ID         */

export const getTopicByTitle = (req: Request, res: Response) => getEntityByTitle(req, res, 'topic');
export const getSheetByTitle = (req: Request, res: Response) => getEntityByTitle(req, res, 'sheet');
export const getQuestionByTitle = (req: Request, res: Response) => getEntityByTitle(req, res, 'question');
const include = {
  image: true,
  topic: {
    select: {
      topic: {
        select: {
          title: true,
        },
      },
    },
  },
};

export const getQuestionsById = async (req: Request, res: Response) => await getEntityById(req,res,'question',include);

export const updateTopic = async (req: Request, res: Response) => await updateEntity(req, res, 'topic');
export const updateSheet = async (req: Request, res: Response) => await updateEntity(req, res, 'sheet');
export const updateQuestion = async (req: Request, res: Response) =>await  updateEntity(req, res, 'question');

export const deleteTopic = (req: Request, res: Response) => deleteEntity(req, res, 'topic');
export const deleteSheet = (req: Request, res: Response) => deleteEntity(req, res, 'sheet');
export const deleteQuestion = (req: Request, res: Response) => deleteEntity(req, res, 'question');

export const getTopMatchRandmonQuestion = async (req:Request,res:Response) => {
  try {
    const topics = req.query.topics?.toString().split(',') || [];
    const users = req.query.users?.toString().split(',') || [];
    const level = req.query.level?.toString() || '';
    const schedule_id = req.query.id?.toString() || ''
    // console.log("get random", topicIds,userIds,difficultyLevel)
    if(topics.length === 0 && users.length === 0 && level===''){
      res.status(401).json({success:false, message: 'Bad request!' });
    }
    const randomQuestion = await getARandomProblem(
      topics,
      users,
      level
    );

    if (randomQuestion) {
      res.json({success:true,problem: randomQuestion});
      if(schedule_id){
        updateRoom({id:schedule_id,slug:randomQuestion.slug});
      }

    } else {
      res.status(404).json({success:false, message: 'No matching question found' });
    }
  } catch (error) {
    console.error('Error in random-question route:', error);
    res.status(500).json({ success:false, message: 'Internal server error' });
  }
}

// export const createQuestion = async (req: Request, res: Response) => {
//   const {title, description, difficulty_level, average_time_to_solve, image,topic_id} = req.body;

//   // if image then insert in the image table 
//   // if topic id then create the relation between qeustion and topic id
  
//   const questionData: any = {
//     // title,
//     description,
//     difficulty_level,
//     average_time_to_solve,
//   };

//   // if (image!== null && image != undefined && image.length>0) {
//   //   questionData.images = {
//   //     create: image.map((url: string) => ({
//   //       image_url: url,
//   //     })),
//   //   };
//   // }

//   if (topic_id!== null && topic_id != undefined && topic_id.length>0) {
//     questionData.topics = {
//       create: topic_id.map((id: string) => ({
//         topic_id: id,
//       })),
//     };
//   }

//   const question = await prisma.question.create({
//     data: questionData,
//     include: {
//       images: true,
//       topics: true,
//     },
//   });

//   res.json(question);
// };
 // const question = await prisma.question.create({
  //   data: {
  //     // title,
  //     description,
  //     difficulty_level,
  //     average_time_to_solve 
  //   },
  // });


// export const createQuestion = (req: Request<{}, {}, CreateQuestionInput>, res: Response) => createEntity(req, res, 'question');
// import { randomUUID } from 'crypto';
// export const createTopic = async (req: Request<{}, {}, CreateTopicInput>, res: Response) => {
//   const { title, description, image } = req.body;

//   const topic = await prisma.topic.create({
//     data: {
//       title,
//       description,
//       image,
//     },
//   });

//   res.json(topic);
// };

// export const createSheet = async (req: Request<{}, {}, CreateSheetInput>, res: Response) => {
//   const { title, description, image } = req.body;

//   const sheet = await prisma.sheet.create({
//     data: {
//       title,
//       description,
//       image
//     },
//   });

//   res.json(sheet);
// };
// export const getTopicByTitle = async (req: Request, res: Response) => {
//   const { title} = req.params;
//   const topic = await prisma.topic.findMany({where: {title: title }}); // convert into findUnique

//   if (!topic) {
//     return res.status(404).json({ error: 'Topic not found' });
//   }

//   res.json(topic);
// };

// // Get sheet by title
// export const getSheetByTitle = async (req: Request, res: Response) => {
//   const { title } = req.params;
//   const sheet = await prisma.sheet.findMany({
//     where: { title },
//   });

//   if (!sheet) {
//     return res.status(404).json({ error: 'Sheet not found' });
//   }

//   res.json(sheet);
// };

// // Get question by title
// export const getQuestionByTitle = async (req: Request, res: Response) => {
//   const { title } = req.params;
//   const question = await prisma.question.findMany({
//     where: { title },
//   });

//   if (!question) {
//     return res.status(404).json({ error: 'Question not found' });
//   }

//   res.json(question);
// };

// export const getAllQuestions = async (req: Request, res: Response) => {
//   const { pageNumber, limitNumber } = getPaginationParams(req);
//   const result = await paginate(req, prisma.question, pageNumber, limitNumber);
//   res.json(result);
// };

// Get questions by user ID (assuming there's a user relation)
// Update a sheet
 // const { id } = getIdParamSchema.parse(req.params);
  // const updateData = buildUpdateData(req.body);

  // const updatedSheet = await prisma.sheet.update({
  //   where: { sheet_id: id },
  //   data: updateData,
  // });

  // res.json(updatedSheet);
//   const { id } = getIdParamSchema.parse(req.params);
//   const { title, description, difficulty_level, average_time_to_solve, image, topic_id } = req.body;

//   const updatedQuestion = await prisma.question.update({
//     where: { question_id: id },
//     data: {
//       // title,
//       description,
//       difficulty_level,
//       average_time_to_solve,
//       topics: topic_id ? { set: topic_id.map(id => ({ id })) } : undefined,
//     },
//   });

//   res.json(updatedQuestion);
// };


// Delete a topic

// export const deleteTopic = async (req: Request, res: Response) => {
//   const { id } = getIdParamSchema.parse(req.params);

//   await prisma.topic.delete({
//     where: { topic_id: id },
//   });

//   res.status(204).send();
// };

// // Delete a sheet

// export const deleteSheet = async (req: Request, res: Response) => {
//   const { id } = getIdParamSchema.parse(req.params);

//   await prisma.sheet.delete({
//     where: { sheet_id: id },
//   });

//   res.status(204).send();
// };

// // Delete a question
// export const deleteQuestion = async (req: Request, res: Response) => {
//   const { id } = getIdParamSchema.parse(req.params);

//   await prisma.question.delete({
//     where: { question_id: id },
//   });

//   res.status(204).send();
// };
