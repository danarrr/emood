import Taro from '@tarojs/taro'
import { refreshLogin } from '@utils/login'

// 云开发请求封装
export async function cloudRequest(options, retry = true) {
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

  // 判断鉴权过期（假设401或后端自定义code为40101）
  if ((res.statusCode === 401 || res.data?.code === 40101) && retry) {
    const success = await refreshLogin();
    if (success) {
      token = Taro.getStorageSync('authorization')?.token;
      return cloudRequest({ ...options, header: { ...options.header, authorization: token } }, false);
    }
  }

  return res;
} 