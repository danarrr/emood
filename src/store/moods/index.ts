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

const initialState: State = {
  moodList: {
    status: DataStatus.INITIAL,
    data: {}
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
        state.moodList.data = {...state.moodList.data, ...payload.data.data};
        return state;
      });
  },
});

export const {} = moodSlice.actions;

