import * as qiniu from 'qiniu-js';
import { uploadToken } from '@/services/common';

const config = {
  useCdnDomain: true,
  useHttpsDomain: true
};

const fetchGetGipher = async () => {
  try {
    let res = await uploadToken(); //测试await getGipher(type);
    console.log(res);
    if (res.isSuc) {
      return res.result;
    }
  } catch (e) {}
};

export const qiniuUpload = async ({ file }) => {
  const key = file.name;
  let uploadData = await fetchGetGipher();
  let _config = {
    ...uploadData.config,
    ...config
  };
  return new Promise((resolve, reject) => {
    const observable = qiniu.upload(file, key, uploadData.token, uploadData.putExtra, _config);
    const observer = {
      next(res) {},
      error(err) {
        reject(err);
      },
      complete(res) {
        console.log('complete:', res);
        resolve(res);
        // qiniu.getUploadUrl(_config, uploadData.token).then(url => {
        //   console.log(':ssss', url);
        //   resolve(url);
        // });
      }
    };
    const subscription = observable.subscribe(observer);
    // 取消上传
    // subscription.unsubscribe();
  });
};
