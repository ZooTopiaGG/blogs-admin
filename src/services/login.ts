import request from '@/utils/request';
// import { buildGET } from '@/utils/utils';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

// 登录
export async function fakeAccountLogin(params: any) {
  return request(`/login`, {
    method: 'POST',
    data: params
  });
}

// 注册
export async function createAccount(params: any) {
  return request(`/signup`, {
    method: 'POST',
    data: params
  });
}

// userInfo
export async function userInfo(id:any) {
  return request(`/getInfo/${id}`);
}

export async function getFakeCaptcha(params:any) {
  return false;
}