import Taro from '@tarojs/taro';
import { createSlice } from '@reduxjs/toolkit';
import { getMoodListAction } from './actions';
import {DataStatus, HasStatus } from '../interface';

export enum MOOD_TYPE {
  HAO = 'hao',
  HENBANG = 'henbang',
  YIBAN = 'yiban',
  LEI = 'lei',
  XINDONG = 'xindong',
  YOUYU = 'youyu',
  SHENGQI = 'shengqi',
  PINGJING = 'pingjing',
  JIAOLV = 'jiaolv',
}

export type MoodListData = {
  [key in string] : {
    imgs: string;
    content: string
    dateStr: string
    mood: MOOD_TYPE
    timestamp: number
  }
}
export type MoodListMonthData = {
  [key in string] : MoodListData
}

type State = {
  moodList: HasStatus<MoodListMonthData>
}

let cachedMoodList = {};
try {
  cachedMoodList = Taro.getStorageSync('moodListCache') || {};
} catch (e) {
  cachedMoodList = {};
}

const initialState: State = {
  moodList: {
    status: Object.keys(cachedMoodList).length ? DataStatus.SUCCESS : DataStatus.INITIAL,
    data: cachedMoodList
  }
}

export const moodSlice = createSlice({
  name: 'moodSlice',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMoodListAction.pending, (state) => {
        state.moodList.status = DataStatus.PENDING;
      })
      .addCase(getMoodListAction.rejected, (state) => {
        state.moodList.status = DataStatus.FAILED;
      })
      .addCase(getMoodListAction.fulfilled, (state, { payload }) => {
        if (!payload.data) {
          state.moodList.status = DataStatus.FAILED;
          return state;
        }
        state.moodList.status = DataStatus.SUCCESS;
        state.moodList.data = {...state.moodList.data, ...payload.data};
        Taro.setStorageSync('moodListCache', state.moodList.data); // 更新缓存
        return state;
      });
  },
});

export const {} = moodSlice.actions;

