import Taro from '@tarojs/taro'
import { refreshLogin, loginAndStore } from '@utils/login'

const NOLOGIN = 40002

// 云开发请求封装
export async function cloudRequest(options) {
  let token = Taro.getStorageSync('authorization')?.token;
  const callOptions = {
    ...options,
    header: {
      'X-WX-SERVICE': 'emh-platform-server',
      authorization: token,
      ...(options.header || {})
    }
  };

  const res = await Taro.cloud.callContainer(callOptions);

  // 判断JWT过期 (code: -1, message: "jwt expired")
  if ((res.data?.code === -1 && res.data?.message === "jwt expired") || res.data.code === NOLOGIN) {
    const success = await loginAndStore();
    if (success) {
      token = Taro.getStorageSync('authorization')?.token;
      return cloudRequest({ ...options, header: { ...options.header, authorization: token } });
    }
  }

  // 判断鉴权过期（假设401或后端自定义code为40101）
  if ((res.statusCode === 401 || res.data?.code === 40101)) {
    const success = await refreshLogin();
    if (success) {
      token = Taro.getStorageSync('authorization')?.token;
      return cloudRequest({ ...options, header: { ...options.header, authorization: token } });
    }
  }

  return res;
} 