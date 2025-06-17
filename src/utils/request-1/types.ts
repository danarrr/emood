// 请求方法类型
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

// 请求配置接口
export interface RequestOptions {
  url: string;
  method?: Method;
  data?: any;
  header?: any;
  loading?: boolean;
  loadingText?: string;
}

// 响应数据接口
export interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
} 