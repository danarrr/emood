// API路径配置
export const API = {
  // 心情相关接口
  mood: {
    list: '/api/mood/list', // 获取心情列表
    records: '/api/mood/records', // 获取心情记录
    add: '/api/mood/add', // 添加心情记录
    update: '/api/mood/update', // 更新心情记录
    delete: '/api/mood/delete', // 删除心情记录
  },
  // 用户相关接口
  user: {
    login: '/api/user/login', // 用户登录
    register: '/api/user/register', // 用户注册
    info: '/api/user/info', // 获取用户信息
    update: '/api/user/update', // 更新用户信息
  },
}; 