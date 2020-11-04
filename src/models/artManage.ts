import { Reducer, Effect } from 'umi';
import {
  writeArticle,
  getArticleList,
  getArticleById,
  updateArticle
} from '@/services/artManage';
import { message } from 'antd';

export interface ModelType {
  namespace: string;
  state: any;
  effects: {
    articleEffect: Effect;
    getArticleListEffect: Effect;
    getArticleByIdEffect: Effect;
  };
  reducers: {
    getArticleListReducer: Reducer<any>;
    getArticleByIdReducer: Reducer<any>;
    queryParamsReducer: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'artManage',

  state: {
    list: null,
    artInfo: null,
    listData: null,
    queryParams: {
      page: 1,
      pageSize: 10,
      columntype: -1 // -1 全部
    }
  },

  effects: {
    *articleEffect({ payload }, { call }) {
      const { params, isEdit, resolve, reject } = payload;
      console.log(payload)
      const response = yield call(isEdit ? updateArticle : writeArticle, params);
      console.log('res":', response)
      if (response.isSuc) {
        message.success('操作成功');
        resolve(response.result);
      } else {
        reject(response.message);
        message.error(response.message);
      }
    },

    *getArticleListEffect({ payload }, { call, put }) {
      const response = yield call(getArticleList, payload);
      if (response.isSuc) {
        console.log('创建成功！', response.result);
        yield put({
          type: 'getArticleListReducer',
          payload: response
        });
      } else { 
        message.error(response.message)
      }
    },

    *getArticleByIdEffect({ payload }, { call, put }) {
      const response = yield call(getArticleById, payload);
      if (response.isSuc) {
        console.log('创建成功！', response.result);
        yield put({
          type: 'getArticleByIdReducer',
          payload: response.result
        });
      } else { 
        message.error(response.message)
      }
    },
  },

  reducers: {
    getArticleByIdReducer(state, { payload }) {
      return {
        ...state,
        artInfo: payload
      };
    },
    getArticleListReducer(state, { payload }) {
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
