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

