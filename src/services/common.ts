import request from '@/utils/request';

export async function upload(file: any, url?:any) {
  let _url = url ? url : '/upload'
  return new Promise((resolve, reject) => {
    let _data = new FormData();
    _data.append('file', file);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('post', UMI_API_BASE + _url, true);
    xmlHttp.send(_data);
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          var data = xmlHttp.responseText;
          let urlJson = JSON.parse(data);
          console.log(urlJson);
          resolve(urlJson);
          // console.log(JSON.parse(data));
        } else {
          reject(false);
        }
      }
    };
  });
}

export async function defaultCover() {
  return request(`/defaultCover`);
}