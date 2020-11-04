import { Reducer, Effect } from 'umi';
import { getAudioList } from '@/services/musicManage';
import { message } from 'antd';

export interface ModelType {
  namespace: string;
  state: any;
  effects: {
    getAudioListEffect: Effect;
  };
  reducers: {
    getAudioListReducer: Reducer<any>;
    queryParamsReducer: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'musicManage',

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
    *getAudioListEffect({ payload }, { call, put }) {
      const response = yield call(getAudioList, payload);
      if (response.isSuc) {
        console.log('创建成功！', response);
        yield put({
          type: 'getAudioListReducer',
          payload: response
        });
      } else {
        message.error(response.message);
      }
    }
  },

  reducers: {
    getAudioListReducer(state, { payload }) {
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
