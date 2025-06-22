import { createAsyncThunk } from "@reduxjs/toolkit";
import Taro from "@tarojs/taro";

interface getMoodListPayload {
  data: {
    year: number;
    month?: number;
    day?: number;
  };
  token: string;
}

export const getMoodListAction = createAsyncThunk('moodSlice/getMoodListAction', async ({data, token}: getMoodListPayload) => {
  return await Taro.cloud.callContainer({
    data,
    path: '/mood/list',
    method: 'GET',
    header: {
      'X-WX-SERVICE': 'emh-platform-server',
      'authorization': token
    }
  });
});
