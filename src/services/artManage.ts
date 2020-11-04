import request from '@/utils/request';

export async function writeArticle(params: any) {
  return request(`/writeArticle`, {
    method: 'POST',
    data: params
  });
}

export async function updateArticle(params: any) {
  return request(`/updateArticle`, {
    method: 'POST',
    data: params
  });
}

export async function getArticleList(params: any) {
  return request(`/getArticle`, {
    method: 'POST',
    data: params
  });
}

export async function getArticleById(id: any) {
  // const url = buildGET(`/qrcode/download/${id}`);
  return request(`/getArticle/${id}`);
}

// /api/deleteArticle
export async function deleteArticleById(id: any) {
  // const url = buildGET(`/qrcode/download/${id}`);
  return request(`/deleteArticle/${id}`);
}