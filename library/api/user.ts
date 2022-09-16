import axios, { AxiosResponse } from 'axios';
import { UserState } from '../types/user';
import { _axiosm } from './interceptor'
import { TeamDataI, GetUploadUrlParamsI, MenuDataI } from '../types/global';

export interface LoginData {
  email: string;
  password: string;
  captchaId: string;
  captcha: string;
}

export interface LoginRes {
  token: string;
}

// 获取验证码
export function getCode() {
  return _axiosm.get('/member/v1/captcha');
}

// 登录
export function login(data: LoginData) {
  return _axiosm.post('/member/v1/login', data);
}

// 登出
export function logout() {
  return _axiosm.get('/member/v1/logout');
}

// 获取用户信息
export function getUserInfo() {
  return _axiosm.get<UserState>('/member/v1/member-info');
}

// 用户加入团队 --- 注册
export function reg(data: any) {
  return _axiosm.post('/member/v1/register', data);
}

// 用户已登录 想要 加入团队
export function bindTeam(data: any) {
  return _axiosm.post('/member/v1/invite-member', data);
}

// 获取所有团队及产品
export function getTeamProduct(): Promise<AxiosResponse<TeamDataI>> {
  return _axiosm.get('/member/v1/joined-team-product');
}


// 加入成功后弹窗数据
export function popData(data: any) {
  return _axiosm.get('/member/v1/pop-invite-success', {
    params: {
      ...data,
    },
  });
}

// 邮箱验证
export function emailVerify(data: any) {
  return _axiosm.post('/member/v1/member-account-verify', data);
}

// 获取邮箱验证
export function getEmailcode(data: any) {
  return _axiosm.post('/member/v1/send-email-verify', data);
}

// 获取上传地址
export function getUpload(params: GetUploadUrlParamsI): Promise<AxiosResponse<{sign_url: string}>> {
  return axios.get('http://store-api.test.ads4ddcc.com/store/v1/sign-upload-object', {params});
}

// 上传图片至OSS
export function upload(url: any, obj: File):Promise<AxiosResponse<string>> {
  return axios.put(url, obj);
}

// 修改个人信息
export function amendUserinfo(obj: any) {
  return _axiosm.post('/member/v1/update-member-info', obj);
}
