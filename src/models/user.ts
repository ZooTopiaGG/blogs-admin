import { Effect, Reducer } from 'umi';

import { userInfo } from '@/services/login';

export interface UserModelState {
  currentUser?: any;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {}
  },

  effects: {
    *fetchCurrent({ payload }, { call, put }) {
      console.log(payload)
      const response = yield call(userInfo, payload.id);
      console.log(response)
      if (response.isSuc) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.result
        });
      }
    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {}
      };
    }
  }
};

export default UserModel;
