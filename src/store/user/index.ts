import Taro from '@tarojs/taro';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataStatus, HasStatus } from '../interface';
import { getUserInfoAction } from './actions';

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  gender?: string;
  email?: string;
  currentSkin: string
  birthdayMoonth?: string
  [key: string]: any;
}

let cachedUserInfo = null;
try {
  cachedUserInfo = Taro.getStorageSync('userInfoCache') || null;
} catch (e) {
  cachedUserInfo = null;
}

type State = {
  userInfo: HasStatus<UserInfo | null>;
};

const initialState: State = {
  userInfo: {
    status: cachedUserInfo ? DataStatus.SUCCESS : DataStatus.INITIAL,
    data: cachedUserInfo,
  },
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserInfo>) {
      state.userInfo.data = action.payload;
      state.userInfo.status = DataStatus.SUCCESS;
      Taro.setStorageSync('userInfoCache', action.payload);
    },
    clearUserInfo(state) {
      state.userInfo.data = null;
      state.userInfo.status = DataStatus.INITIAL;
      Taro.removeStorageSync('userInfoCache');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfoAction.pending, (state) => {
        state.userInfo.status = DataStatus.PENDING;
      })
      .addCase(getUserInfoAction.rejected, (state) => {
        state.userInfo.status = DataStatus.FAILED;
      })
      .addCase(getUserInfoAction.fulfilled, (state, { payload }) => {
        if (!payload.data) {
          state.userInfo.status = DataStatus.FAILED;
          return state;
        }
        state.userInfo.status = DataStatus.SUCCESS;
        state.userInfo.data = payload.data;
        Taro.setStorageSync('userInfoCache', payload.data);
        return state;
      });
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer; 