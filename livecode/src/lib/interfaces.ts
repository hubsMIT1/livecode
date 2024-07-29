import { problemsData } from "@/api/constants";
// import { Users } from "lucide-react";

// interfaces.ts
export interface Problem {
  question_id: string;
  title: string;
  slug:string;
  difficulty_level: 'Easy' | 'Medium' | 'Hard';
  average_time_to_solve: number;
  topic:{title:string}[]
}


export interface Column {
  key: keyof Problem | keyof Schedule;
  header: string;
}

export interface FilterOption {
  id: string;
  label: string;
}

// data.ts

export const problems = problemsData

export const columns: Column[] = [
  // { key: 'status', header: 'Status' },
  { key: 'title', header: 'Title' },
  { key: 'difficulty_level', header: 'Difficulty' },
  { key: 'average_time_to_solve', header: 'Avg Time' },
  {key:'topic',header:'Topics'}
  // { key: 'solved_by', header: 'Solved by' },
];

export const scheduleColumns: Column[] = [
  { key: 'status', header: 'Status' },
  { key: 'start_time', header: 'Date & Time' },
  { key: 'allowed_users', header: 'Participants' },
  // { key: 'action', header: 'Action' },
  { key: 'join_link', header: 'Action' },
  { key: 'topic', header: 'Topics' },
  { key: 'level', header: 'Level' },
  { key: 'question', header: 'Questions' },
  { key: 'feedback', header: 'Feedback' },
];

export const scheduleFilterOptions: FilterOption[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'past', label: 'Past' },
];

export const filterOptions: FilterOption[] = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
  { id: 'solved', label: 'Solved' },
  { id: 'attempted', label: 'Attempted' },
  { id: 'todo', label: 'Todo' },
];
export interface Topic {
  id: string;
  label: string;
}
export interface ScheduleSession {
  id: string;
  status: 'Absent' | 'Going' | 'Completed' | 'Pause';
  time: string;
  participants: string[];
  action: string;
  // joinLink: string;
  selectedTopics: string[];
  level: string;
  questions: string;
  feedback: string;
}

export interface RegistrationData {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

export interface LoginData {
  credential: string;
  password: string;
}

export interface User {
  user_id: string;
  username: string;
  email?: string;
  fullName?: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token:string
}

export interface AuthResult {
  success: boolean;
  errors?: {
    username?: string;
    fullName?: string;
    email?: string;
    password?: string;
    general?: string;
  };
  user?: User;
  access_token?: string;
}

export interface JoinRequestData {
  username: string;
}

export interface NoUserData {
  data: string;
}


export interface JoinStatusData {
  status: string;
  isOwner: boolean;
  message: string;
  from: string;
  type: string;
  roomId?: string;
  ownerId?: string;
  allowedUser?: string[];
}

export interface OfferData {
  offer: RTCSessionDescriptionInit;
}

export interface AnswerData {
  answer: RTCSessionDescriptionInit;
}

export interface IceCandidateData {
  candidate: RTCIceCandidateInit;
}

export interface JoinRequestData {
  userId: string;
}

export interface NoUserData {
  data: string;
}

export interface UserLeftData {
  userId: string;
}
export interface UserDetails {
  user_id?: string;
  username: string;
  isOwner?: boolean;
  status?: boolean;
  // Add any other user details you want to store
}
export interface Error {
  [key: string]: string | number | null
}
export interface ResponseProps {
  success: boolean;
  errors?: Error;
  data?: Schedule | TopicData | Question | Solution | Sheet | Problem | TopicData[] | Question[] | Solution[] | Sheet[] | Schedule[] | Problem []
  total?: number,
  pageNumber?: number,
  limitNumber?: number,
 
  totalPages?: number,
}
export interface ScheduleResponseProps{
  success: boolean;
  errors?: Error;
  data?: Schedule;
}
export interface getAllResponse {
  success: boolean;
  results?:TopicData[] | Question[] | Solution[] | Sheet[] | Schedule[]
  
  total:number,
  pageNumber:number,
  limitNumber:number,
  totalPages:number,
  errors?: Error;
}

export interface ScheduleRecord {
  level: string;
  topic: string[];
  start_time: number;
}
export interface updateContestProps { 
  level?: string;
   start_time?: number;
    topic?: string[];
}

export interface TopicRecord {
  title: string,
  description: string,
  image?: string,
}

export interface QuestionRecord {
  title: string;
  slug: string;
  topic: string[];
  difficulty_level: string;
}

export interface Schedule {
  schedule_id: string | undefined;
  level: string;
  join_link?: string | null;
  start_time: string;
  created_at: string;
  owner_id: string;
  allowed_users: string[];
  status?: string | null;
  end_time?: string | null;
  question_slug?: string | null;
  owner?: User;
  question?: Question;
  topic?: string[];
  feedback?: Feedback[];
  topicIds?: string[]
}

export interface ScheduleTopic {
  topic_id: string;
  schedule_id: string;
  schedule: Schedule;
  topic: Topic;
}

export interface Feedback {
  feedback_id: string;
  problem_solving_rating: number;
  coding_rating: number;
  communication_rating: number;
  peer_strengths: string;
  areas_for_improvement?: string;
  interviewer_rating: number;
  topic_rating: number;
  interviewee: string;
  schedule_id: string;
}

export interface Solution {
  solution_id: string;
  solution_text: string;
  submission_status: string;
  created_at: Date;
  question_id: string;
  user_id: string;
  user: User;
  question: Question;
}

export interface TopicQuestion {
  topic_id: string;
  question_id: string;
  topic: Topic;
  question: Question;
}

export interface SheetQuestion {
  sheet_id: string;
  question_id: string;
  sheet: Sheet;
  question: Question;
}

export interface TopicData {
  topic_id: string;
  title: string;
  description?: string;
  image?: string;
  question?: TopicQuestion[];
}

export interface Sheet {
  sheet_id: string;
  title: string;
  description?: string;
  image?: string;
  question?: SheetQuestion[];
}

export interface Question {
  question_id: string;
  title: string;
  slug: string;
  description?: string;
  difficulty_level: string;
  average_time_to_solve?: number;
  solution: Solution[];
  topic?: TopicQuestion[];
  sheet?: SheetQuestion[];
  // scheduel?: Schedule[]; // Note: There's a typo in your schema, it should be "schedule"
}