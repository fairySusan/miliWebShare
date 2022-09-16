import axios, { AxiosRequestConfig } from 'axios';
import { AuthTool } from '../utils';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

export const _axiosm = axios.create({
  baseURL: import.meta.env.VITE_API_MEMBER_URL,
  timeout: 1000*30,
  headers: {}
})

const requestInterceptor = (config: AxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = {};
  }
  config.headers.Authorization = `${AuthTool.getToken()}`;
  config.headers.CompanyId = `${localStorage.getItem('CompanyId')}`;
  return config;
}

_axiosm.interceptors.request.use(requestInterceptor,
  (error) => {
    return Promise.reject(error);
  }
)