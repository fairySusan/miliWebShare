import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '../store';
import { getToken } from '../utils/auth';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

console.log(process.env)

export const _axiosm = axios.create({
  baseURL: import.meta.env.VITE_API_MEMBER_URL,
  timeout: 1000*30,
  headers: {}
})

const requestInterceptor = (config: AxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = {};
  }
  config.headers.Authorization = `${getToken()}`;
  config.headers.CompanyId = `${localStorage.getItem('CompanyId')}`;
  return config;
}

_axiosm.interceptors.request.use(requestInterceptor,
  (error) => {
    return Promise.reject(error);
  }
)