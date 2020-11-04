import { Reducer, Effect } from 'umi';
import { getDynamicList, writeDynamic } from '@/services/dyManage';
import { message } from 'antd';

export interface ModelType {
  namespace: string;
  state: any;
  effects: {
    dynamicEffect: Effect;
    getDynamicListEffect: Effect;
  };
  reducers: {
    getDynamicListReducer: Reducer<any>;
    queryParamsReducer: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'dyManage',

  state: {
    list: null,
    listData: null,
    queryParams: {
      page: 1,
      pageSize: 10,
      columntype: -1 // -1 全部
    }
  },

  effects: {
    *dynamicEffect({ payload }, { call }) {
      const { params, resolve, reject } = payload;
      console.log(payload);
      const response = yield call(writeDynamic, params);
      console.log('res":', response);
      if (response.isSuc) {
        message.success('操作成功');
        resolve(response.result);
      } else {
        reject(response.message);
        message.error(response.message);
      }
    },

    *getDynamicListEffect({ payload }, { call, put }) {
      const response = yield call(getDynamicList, payload);
      if (response.isSuc) {
        console.log('创建成功！', response);
        yield put({
          type: 'getDynamicListReducer',
          payload: response
        });
      } else {
        message.error(response.message);
      }
    }
  },

  reducers: {
    getDynamicListReducer(state, { payload }) {
      return {
        ...state,
        list: payload.result,
        listData: payload
      };
    },
    queryParamsReducer(state, { payload }) {
      return {
        ...state,
        queryParams: payload
      };
    }
  }
};

export default Model;
