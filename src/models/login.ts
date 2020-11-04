import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { fakeAccountLogin, createAccount } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import Cookies from 'js-cookie';
import { message } from 'antd';

export interface LoginModelType {
  namespace: string;
  state: any;
  effects: {
    login: Effect;
    logout: Effect;
    create: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<any>;
    employeesList: Reducer<any>;
    queryParams: Reducer<any>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
    employeesData: null,
    employeesList: null,
    queryParams: {
      pageNum: 1,
      pageSize: 10,
      phone: ''
    }
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      console.log(response)
      if (response.isSuc === true) {
        // Login successfully
        console.log(response);
        yield put({
          type: 'changeLoginStatus', // reducers
          payload: response.result
        });
        Cookies.set('YYN_TOKEN', response.result.id);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      } else {
        message.error(response.message);
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      Cookies.remove('YYN_TOKEN');
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href
          })
        });
      }
    },

    *create({ payload }, { call }) {
      const { params, resolve, reject } = payload;
      const response = yield call(createAccount, params);
      if (response.isSuc === true) {
        console.log('创建成功！', response.data);
        message.success('创建成功！');
        resolve(response.data);
      } else {
        message.error(response.msg);
        reject(response.msg);
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log('payload:', payload);
      switch (payload.name) {
        case 'FeRookie':
          // 超级管理员
          setAuthority('superAdmin');
          break;
        case '蔡沛眙':
          // 普通管理员
          setAuthority('admin');
          break;
        case '邓浩':
          // 二维码管理员
          setAuthority('user');
          break;
        default:
          setAuthority('guest');
      }
      return {
        ...state,
        status: true
      };
    },
    
    employeesList(state, { payload }) {
      return {
        ...state,
        employeesList:
          payload.data &&
          payload.data.map((x: any) => {
            x.key = x.id;
            return x;
          }),
        employeesData: payload
      };
    },
    queryParams(state, { payload }) {
      return {
        ...state,
        queryParams: payload
      };
    }
  }
};

export default Model;
