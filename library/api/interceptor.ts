import { Message, Modal } from '@arco-design/web-vue';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useUserStore } from '../store';
import { AuthTool } from '../utils';
import { HttpResponse } from '../types/global'

// 当前平台-相关接口的请求
const _axios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 1000*30,
  headers: {}
});

// 业务平台-相关接口的请求：比如登录
const _axiosm = axios.create({
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

// 响应拦截器
const responseInterceptor = (response: AxiosResponse<HttpResponse>) => {
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
}

// 错误响应的拦截器
const errorResponseInterceptor = (error: any) => {
  // if (error.response.status === 401) {
  //   router.replace('/login')
  // }
  if (error.response.config.url !== '/member/v1/get-menu') {
    Message.error({
      content: error.response.data.message || '请求错误',
      duration: 5 * 1000,
    });
  }
  return Promise.reject(error);
}

_axios.interceptors.response.use(responseInterceptor,errorResponseInterceptor)

_axiosm.interceptors.response.use(responseInterceptor,errorResponseInterceptor)

export {
  HttpResponse,
  _axios,
  _axiosm
}