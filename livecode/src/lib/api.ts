import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Feedback, Question, QuestionRecord, ResponseProps, Schedule, ScheduleRecord, ScheduleSession, Sheet, Solution, TopicData, TopicRecord, getAllResponse } from './interfaces';
// console.log(import.meta.env.VITE_BASE_URL)
const BASE_URL = import.meta.env.VITE_BASE_URL //'http://localhost:3001/api/';
const GITHUB_PROBLEM_PATH = import.meta.env.VITE_GITHUB_PROBLEM_PATH // 'https://raw.githubusercontent.com/hubsMIT1/livecode/master/problems/';

// Create a custom axios instance
const customAxios = axios.create({
  baseURL: BASE_URL,
});
const generateRefreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    const res = await customAxios.get(`users/auth/refresh_token`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refresh}`,
      },
    });
    const data = res.data;
    console.log(data);
    localStorage.setItem('access_token', data.access_token);
    return data.access_token; // Return the new access token
  } catch (error: any) {
    console.error(error);
    toast.error(error?.response?.data?.error?.message || 'Failed to refresh token');
    throw error; // Rethrow the error to be caught in the interceptor
  }
};
// Add response interceptor
customAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if ((error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await generateRefreshToken();
        // Update the Authorization header with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return customAxios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // If refresh fails, you might want to redirect to login or handle it appropriately
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number | null;
}

export async function callApi<T = any>(
  method: string,
  route: string,
  data?: any,
  params?: any,
  headers?: any
): Promise<ApiResponse<T>> {
  const access_token = localStorage.getItem('access_token') || null;
  const url = `${route}`;
  const config: AxiosRequestConfig = {
    method,
    url,
    data,
    params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`,
      ...headers,
    },
  };
  try {
    const response: AxiosResponse<T> = await customAxios(config);
    return {
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      return {
        data: null,
        error: axiosError.response?.data?.message || axiosError.message,
        status: axiosError.response?.status || null,
      };
    } else {
      return {
        data: null,
        error: 'An unexpected error occurred',
        status: null,
      };
    }
  }
}

export const getContentFromGithub = async (route: string) => {
  try {
    const response = await fetch(`${GITHUB_PROBLEM_PATH}${route}`);
    const text = await response.text();
    console.log(text);
    return text;
  } catch (error) {
    console.error('Error fetching file:', error);
    return "NOT FOUND";
  }
};

export const handleCalledApi = async (
  method: string,
  endpoint: string,
  data?: Schedule | Feedback | Solution | ScheduleRecord | TopicRecord | QuestionRecord
): Promise<ResponseProps | getAllResponse> => {
  try {
    const response = await callApi<ResponseProps>(method, endpoint, data);
    console.log("response", response);
    if (response.error) {
      console.error(response.error);
      console.log(response.error);
      return { success: false, errors: { message: response.error, status: response?.status } };
    }
    else if (response.data) {
      return response.data;
    }
    return { success: false, errors: { general: 'An unexpected error occurred.' } };
  } catch (error) {
    console.error(`API call error (${endpoint}):`, error);
    return { success: false, errors: { general: 'An unexpected error occurred.' } };
  }
};

// let cnt =0;
// export const refreshToken = async() =>{
//   cnt = 1;
//   const res = await handleCalledApi('POST','users/refresh_token');
//   console.log(res);
//   return res;
// }