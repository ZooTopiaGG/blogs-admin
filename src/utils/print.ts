import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { message } from 'antd';

function getBase64Image(img: any) {
  let canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  let ctx: any = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);
  let ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase();
  return canvas.toDataURL('image/' + ext);
}

//传入图片路径，返回base64
function getBase64(img:any) {
  let image = new Image();
  image.setAttribute('crossOrigin', 'anonymous'); // 必须设置在src之前，跨域使用
  image.src = img;
  return new Promise(resolve => {
    if (img) {
      image.onload = () => {
        resolve(getBase64Image(image));
      };
    }
  });
}

export default function toZip(imgSrcList: any, fileName: any) {
  let imgBase64: any = [];
  let imageSuffix: any = []; //图片后缀
  let zip = new JSZip(); //实例化一个压缩文件对象
  let imgFolder = zip.folder(fileName); //新建一个图片文件夹用来存放图片，参数为文件名
  for (let i = 0; i < imgSrcList.length; i++) {
    let src = imgSrcList[i];
    let suffix = src.substring(src.lastIndexOf('.'));
    imageSuffix.push(suffix);
    getBase64(src)
      .then((base64: any) => imgBase64.push(base64.substring(22)))
      .catch(error => console.log('error', error));
  }

  function polling() {
    setTimeout(() => {
      if (imgSrcList.length === imgBase64.length) {
        for (let i = 0; i < imgSrcList.length; i++) {
          imgFolder.file(i + imageSuffix[i], imgBase64[i], { base64: true });
        }
        zip.generateAsync({ type: 'blob' }).then(function (content: any) {
          FileSaver.saveAs(content, `${fileName}.zip`);
        });
        message.destroy();
        message.success('打包完成');
      } else {
        console.log('已完成：' + imgBase64.length + '/' + imgSrcList.length);
        polling();
      }
    }, 300);
  }

  polling();
}
