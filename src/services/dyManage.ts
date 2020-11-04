import request from '@/utils/request';
import { buildGET } from '@/utils/utils';

export async function writeDynamic(params: any) {
  return request(`/writeDynamic`, {
    method: 'POST',
    data: params
  });
}

export async function delDynamic(params: any) {
  return request(`/delDynamic`, {
    method: 'POST',
    data: params
  });
}

export async function getDynamicList(params: any) {
  const url = buildGET(`/getDynamicList`, params)
  return request(url);
}