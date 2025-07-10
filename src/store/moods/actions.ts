import { createAsyncThunk } from "@reduxjs/toolkit";
import { cloudRequest } from "@/utils/request";

interface getMoodListPayload {
  data: {
    year: number;
    month?: number;
    day?: number;
  }
}

export const getMoodListAction = createAsyncThunk('moodSlice/getMoodListAction', async ({data}: getMoodListPayload) => {
  return await cloudRequest({
    data,
    path: '/mood/list',
    method: 'GET',
  });
});


// 获取带图片的mood列表
export const getMoodDetailListAction = createAsyncThunk('moodSlice/getMoodDetailListAction', async ({data}: getMoodListPayload) => {
  return await cloudRequest({
    data,
    path: '/mood/list?image=1',
    method: 'GET',
  });
});

