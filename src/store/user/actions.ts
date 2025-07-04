import { createAsyncThunk } from '@reduxjs/toolkit';
import { cloudRequest } from '@/utils/request';

interface GetUserInfoPayload {
  token: string;
}

export const getUserInfoAction = createAsyncThunk('userSlice/getUserInfoAction', async () => {
  // 这里可以根据实际接口调整
  return await cloudRequest({
    path: '/account/user-info',
    method: 'GET',
  });
}); 