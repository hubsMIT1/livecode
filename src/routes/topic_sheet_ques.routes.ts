import express from 'express';
import { authMiddleware,isAdminOrStaff } from '../middlewares/auth.middlewares';

import { createTopic, createSheet, createQuestion,addQuestionsToSheet, getAllQuestions,getAllSheets,getAllTopics,getTopicByTitle,getQuestionByTitle, getSheetByTitle,getQuestionsById, updateQuestion,updateSheet,updateTopic, deleteQuestion,deleteSheet,deleteTopic } from '../controllers/topic_sheet_ques.controllers';

import { validateTopicSchema, validateSheetSchema, validateQuestionSchema, validateUpdateQuestionSchema,validateUpdateSheetSchema,validateUpdateTopicSchema,validateQuestionsToSheetSchema,validParams } from '../middlewares/validation.middleware';

const router = express.Router();

//CREATE
router.post('/topic', authMiddleware, isAdminOrStaff, validateTopicSchema, createTopic);
router.post('/sheet', authMiddleware, isAdminOrStaff, validateSheetSchema, createSheet);
router.post('/question', authMiddleware, isAdminOrStaff, validateQuestionSchema, createQuestion);
router.post('/sheet/:id/add-questions', authMiddleware,isAdminOrStaff, validateQuestionsToSheetSchema,addQuestionsToSheet)
//RETRIEVE 
router.get('/topics', getAllTopics);
router.get('/sheets', getAllSheets);
router.get('/questions', getAllQuestions);
router.get('/topic/:title', getTopicByTitle);
router.get('/sheet/:title', getSheetByTitle);
router.get('/question/:title', getQuestionByTitle);
router.get('/question-by-id/:id',validParams, getQuestionsById);

//UPDATE
router.put('/topic/:id', authMiddleware, isAdminOrStaff, validateUpdateTopicSchema, updateTopic);
router.put('/sheet/:id', authMiddleware, isAdminOrStaff, validateUpdateSheetSchema, updateSheet);
router.put('/question/:id', authMiddleware, isAdminOrStaff,validateUpdateQuestionSchema, updateQuestion);

// DELETE
router.delete('/topic/:id', authMiddleware, isAdminOrStaff,validParams, deleteTopic);
router.delete('/sheet/:id', authMiddleware, isAdminOrStaff, deleteSheet);
router.delete('/question/:id', authMiddleware, isAdminOrStaff, deleteQuestion);

export default router;