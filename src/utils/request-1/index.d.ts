import { RequestOptions } from './types';

declare const http: {
  get: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => Promise<T>;
  post: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => Promise<T>;
  put: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => Promise<T>;
  delete: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => Promise<T>;
};

export default http; 