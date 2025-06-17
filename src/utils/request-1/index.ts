import Taro from '@tarojs/taro';
import { Method, RequestOptions, ResponseData } from './types';

// 基础配置
const config = {
  baseUrl: 'http://your-api-base-url', // 替换为实际的API基础URL
  timeout: 10000,
  header: {
    'Content-Type': 'application/json',
  },
};

// 错误码配置
const errorCode = {
  SUCCESS: 0,
  TOKEN_INVALID: 401,
  SERVER_ERROR: 500,
};

// 显示加载提示
const showLoading = (text: string = '加载中...') => {
  Taro.showLoading({
    title: text,
    mask: true,
  });
};

// 隐藏加载提示
const hideLoading = () => {
  Taro.hideLoading();
};

// 显示错误提示
const showError = (message: string) => {
  Taro.showToast({
    title: message,
    icon: 'none',
    duration: 2000,
  });
};

// 处理错误码
const handleErrorCode = (code: number, message: string) => {
  switch (code) {
    case errorCode.TOKEN_INVALID:
      // 处理token失效
      Taro.navigateTo({ url: '/pages/login/index' });
      break;
    case errorCode.SERVER_ERROR:
      showError('服务器错误，请稍后重试');
      break;
    default:
      showError(message || '请求失败');
  }
};

// 请求函数
const request = <T = any>(options: RequestOptions): Promise<T> => {
  const { url, method = 'GET', data, header = {}, loading = true, loadingText } = options;

  // 显示加载提示
  if (loading) {
    showLoading(loadingText);
  }

  // 合并请求头
  const headers = {
    ...config.header,
    ...header,
  };

  // 获取token
  const token = Taro.getStorageSync('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    Taro.request({
      url: `${config.baseUrl}${url}`,
      method,
      data,
      header: headers,
      timeout: config.timeout,
      success: (res) => {
        const { statusCode, data } = res;
        
        // 处理HTTP状态码
        if (statusCode >= 200 && statusCode < 300) {
          const response = data as ResponseData<T>;
          
          // 处理业务状态码
          if (response.code === errorCode.SUCCESS) {
            resolve(response.data);
          } else {
            handleErrorCode(response.code, response.message);
            reject(response);
          }
        } else {
          showError(`请求失败(${statusCode})`);
          reject(res);
        }
      },
      fail: (err) => {
        showError('网络错误，请检查网络连接');
        reject(err);
      },
      complete: () => {
        // 隐藏加载提示
        if (loading) {
          hideLoading();
        }
      },
    });
  });
};

// 导出请求方法
export const http = {
  get: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => {
    return request<T>({ url, method: 'GET', data, ...options });
  },
  post: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => {
    return request<T>({ url, method: 'POST', data, ...options });
  },
  put: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => {
    return request<T>({ url, method: 'PUT', data, ...options });
  },
  delete: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => {
    return request<T>({ url, method: 'DELETE', data, ...options });
  },
};

export default http; 