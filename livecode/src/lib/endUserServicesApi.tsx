// create
// update
// delete
// get

import { handleCalledApi } from "./api";
import {
  problemQueryProbs,
  QuestionRecord,
  ResponseProps,
  ScheduleRecord,
  TopicRecord,
  updateContestProps,
} from "./interfaces";

export const serviceApiAction = () => {
  const createContest = async (
    data: ScheduleRecord
  ): Promise<ResponseProps> => {
    const res = await handleCalledApi(
      "POST",
      "end-user-service/schedule",
      data
    );
    return res;
  };
  const getAllContest = async (page?:number,limit?:number): Promise<ResponseProps> => {
    const res = await handleCalledApi("GET", `end-user-service/schedules?page=${page}&limit=${limit}`);
    if(res.errors){
      console.log(res?.errors?.message);
      return res;
    }
    // const data = res.data
    return res;
  };
  const getContestById = async (id: string): Promise<ResponseProps> => {
    const res = await handleCalledApi("GET", `end-user-service/schedule/${id}`);
    console.log("endserveic api get schedule",res);
    return res;
  };
  const updateContest = async (
    data: updateContestProps,
    id:string
  ): Promise<ResponseProps> => {
    const res = await handleCalledApi("PUT", `end-user-service/schedule/${id}`, data);
    return res;
  };
  const deleteContest = async (id: string): Promise<ResponseProps> => {
    const res = await handleCalledApi(
      "DELETE",
      `end-user-service/schedule/${id}`
    );
    return res;
  };
  const getContestByDate = async (
    start: string,
    end: string
  ): Promise<ResponseProps> => {
    const res = await handleCalledApi(
      "GET",
      `end-user-service/schedule?start=${start}&end=${end}`
    );
    return res;
  };

  const createTopic = async (data: TopicRecord): Promise<ResponseProps> => {
    const res = await handleCalledApi("POST", "service/topic", data);
    return res;
  };
  const updateTopic = async (data: TopicRecord): Promise<ResponseProps> => {
    const res = await handleCalledApi("PUT", "service/topic", data);
    return res;
  };
  const getTopicBytitle = async (title: string): Promise<ResponseProps> => {
    const res = await handleCalledApi("GET", `service/topic/${title}`);
    return res;
  };
  const getAllTopics = async (page?:number,limit?:number): Promise<ResponseProps> => {
    const res = await handleCalledApi("GET", `service/topics?page=${page}&limit=${limit}}`);
    if(res.errors){
      return res;
    }
    return res;
  };
  const deleteTopic = async (id: string): Promise<ResponseProps> => {
    const res = await handleCalledApi("DELETE", `service/topic/${id}`);
    return res;
  };

  const createSheet = async (data: TopicRecord): Promise<ResponseProps> => {
    const res = await handleCalledApi("POST", "service/sheet", data);
    return res;
  };
  const updateSheet = async (data: TopicRecord): Promise<ResponseProps> => {
    const res = await handleCalledApi("PUT", "service/sheet", data);
    return res;
  };
  const getSheetBytitle = async (title: string): Promise<ResponseProps> => {
    const res = await handleCalledApi("GET", `service/sheet/${title}`);
    return res;
  };
  const getAllSheets = async (page?:number,limit?:number): Promise<ResponseProps> => {
    const res = await handleCalledApi("GET", `service/sheets?page=${page}&limit=${limit}`);
    return res;
  };
  const deleteSheet = async (id: string): Promise<ResponseProps> => {
    const res = await handleCalledApi("DELETE", `service/sheet/${id}`);
    return res;
  };

  const createQuestion = async (
    data: QuestionRecord
  ): Promise<ResponseProps> => {
    const res = await handleCalledApi("POST", "service/question", data);
    return res;
  };
  const updateQuestion = async (
    data: QuestionRecord
  ): Promise<ResponseProps> => {
    const res = await handleCalledApi("PUT", "service/question", data);
    return res;
  };
  const getQuestionBySlug = async (slug: string): Promise<ResponseProps> => {
    const res = await handleCalledApi("GET", `service/question/${slug}`);
    return res;
  };
  const getAllQuestions = async (page?:number,limit?:number): Promise<ResponseProps> => {
    const res = await handleCalledApi("GET", `service/questions?page=${page}&limit=${limit}`);
    if(res.success){
      // console.log(res.data)
      return res;
    }
    else {
      return res
    }
  };
  const deleteQuestion = async (id: string): Promise<ResponseProps> => {
    const res = await handleCalledApi("DELETE", `service/question/${id}`);
    return res;
  };

  const getNewRandomProblem = async({id,topics,level,allowed_users}:problemQueryProbs) =>{
    const users = allowed_users.join(',');
    console.log(id,topics,level,allowed_users,users,);
    const queries = `topics=${topics}&users=${users}&level=${level}&id=${id}`
    console.log(queries);
    const res = await handleCalledApi('GET',`service/random-question?${queries}`)
    console.log(res);
    return res;
  }

  return {
    createContest,
    createQuestion,
    createTopic,
    createSheet,
    getAllContest,
    getAllQuestions,
    getAllTopics,
    getAllSheets,
    updateContest,
    updateQuestion,
    updateTopic,
    updateSheet,
    getSheetBytitle,
    getTopicBytitle,
    getContestByDate,
    getContestById,
    getQuestionBySlug,
    deleteContest,
    deleteQuestion,
    deleteTopic,
    deleteSheet,
    getNewRandomProblem,
  };
};
