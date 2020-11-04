import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * 模拟window.open()
 * @export
 * @param {url}
 * @returns
 */
export function winOpen(url: string) {
  const a: any = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('target', '_blank');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function mockAClick(url: string) {
  const a: any = document.createElement('a');
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * @description 自定义时间戳转换日期函数，支持指定格式转换
 * @param {*} ms 必填 毫秒级时间参数
 * @param {string} type 可选 转换类型 支持类似 YY-MM-DD hh:mm:ss  YY年MM月DD日 MM-DD hh:mm等格式
 * @returns 默认返回YY年MM月DD日格式
 */
export function getFormatTime(ms: any, type?: string) {
  if (!ms) {
    return '';
  }
  const time: any = new Date(Number(ms));
  const y = time.getFullYear();
  let m: any = time.getMonth() + 1;
  let d: any = time.getDate();
  let h: any = time.getHours();
  let min: any = time.getMinutes();
  const sec: any = time.getSeconds();
  const now = new Date();
  const nowY = now.getFullYear();
  m = m < 10 ? `'0' + ${m}` : m;
  d = d < 10 ? `'0' + ${d}` : d;
  h = h < 10 ? `'0' + ${h}` : h;
  min = min < 10 ? `'0' + ${min}` : min;
  if (type) {
    return type
      .replace('YY', y)
      .replace('MM', m)
      .replace('DD', d)
      .replace('hh', h)
      .replace('mm', min)
      .replace('ss', sec);
  }
  return nowY > y ? `${y} + '年' + ${m} + '月' + ${d} + '日'` : `${m} + '月' + ${d} + '日'`;
}

class Validate {
  // 身份证校验
  idCard(val: any) {
    return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{7}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/.test(
      val
    );
  }

  // 手机号校验
  phone(val: any) {
    return /^1[3456789]\d{9}$/.test(val);
  }

  // 邮箱
  email(val: any) {
    return /^\w+@[a-z0-9]+\.[a-z]{2,4}$/.test(val);
  }

  // 普通护照
  passport(val: any) {
    return /^((1[45]\d{7})|(G\d{8})|(P\d{7})|(S\d{7,8}))?$/.test(val);
  }

  // 台胞证
  taiwanID(val: any) {
    return /^[a-zA-Z][0-9]{9}$/.test(val);
  }

  // 港澳身份证
  hkId(val: any) {
    return /^([A-Z]\d{6,10}(\w1)?)$/.test(val);
  }

  // 中文
  chineseWord(val: any) {
    return /^[\u4e00-\u9fa5]*$/.test(val);
  }

  // 密码（不能是纯数字或字母）
  psdRxp(val: any) {
    const numberRegexp = /^\d+$/;
    const letterRegexp = /^[a-zA-Z]+$/;
    return numberRegexp.test(val) || letterRegexp.test(val);
  }

  // 纯数字
  onlyNum(val: any) {
    return /^\d*$/.test(val);
  }

  // 账号校验
  account(val: any) {
    return val.length >= 4;
  }

  // 用户名校验
  usernameRegex(val: any) {
    return /^([a-zA-Z0-9_\u4e00-\u9fa5]{1,8})$/.test(val);
  }

  // 特殊字符校验
  strRegex(val: any) {
    return /^([a-zA-Z0-9_\u4e00-\u9fa5]{1,})$/.test(val);
  }

  // 验证URL
  isUrl(val: any) {
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(val);
  }
}

export const validate: any = new Validate();

/**
 * @desc build a get request(构建一个带hash值的get请求)
 * @param
 */
export function buildGET(basePort: any, json: any) {
  let buildGet = basePort;
  let fistNumber = 0;
  for (var key in json) {
    let littlePort = '';
    if (json[key] !== null && json[key] !== 'null') {
      if (fistNumber === 0) {
        littlePort = '?' + key + '=' + json[key];
        fistNumber++;
      } else {
        littlePort = '&' + key + '=' + json[key];
      }
      buildGet += littlePort;
    }
  }
  return String(buildGet);
}

export const getURLParameters = (url: any) => {
  const _url = url.match(/([^?=&]+)(=([^&]*))/g);
  return (
    _url &&
    _url.reduce(
      (a: any, v: any) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a),
      {}
    )
  );
};

const objectTostring = (props: any) => {
  return Object.prototype.toString.call(props);
};

export function testValue(value: any) {
  if (value) {
    let val = objectTostring(value) === '[object String]' ? value : value.toHTML();
    let res = !!val.replace(/<.*?>/g, '') ? val : null;
    return res;
  } else {
    return null;
  }
}