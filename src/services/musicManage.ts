import request from '@/utils/request';

export async function addAudio(params: any) {
  return request(`/addAudio`, {
    method: 'POST',
    data: params
  });
}

export async function getAudioList(params: any) {
  return request(`/getAudioList`, {
    method: 'POST',
    data: params
  });
}

// deleteAudio

export async function deleteAudio(id: any) {
  return request(`/deleteAudio/${id}`);
}