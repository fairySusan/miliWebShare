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

const _axios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 1000*30,
  headers: {}
});


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

_axios.interceptors.request.use(requestInterceptor,
  (error) => {
    return Promise.reject(error);
  }
)

_axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    if (response.status !== 200) {
      Message.error({
        content: response.statusText || '错误',
        duration: 5 * 1000,
      });
      if ([50008, 50012, 50014].includes(response.status) && response.config.url !== '/api/user/info') {
        Modal.error({
          title: '提示',
          content: '你已经退出登录！',
          okText: '重新登录',
          async onOk() {
            const userStore = useUserStore();
            await userStore.logout();
            window.location.reload();
          },
        });
      }
      return Promise.reject(new Error(response.statusText || 'Error'));
    }
    return Promise.resolve(response);
  },
  (error) => {
    if (error.response.config.url !== '/member/v1/get-menu') {
      Message.error({
        content: error.response.data.message || '请求错误',
        duration: 5 * 1000,
      });
    }
    return Promise.reject(error);
  }
)

export default _axios