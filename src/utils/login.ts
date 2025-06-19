import Taro from '@tarojs/taro'

// 登录信息接口
interface LoginInfo {
  userInfo: any
  token: string
  timestamp: number
  expires: number
}

// 获取登录信息
export const getLoginInfo = (): LoginInfo | null => {
  try {
    return Taro.getStorageSync('login_info')
  } catch (error) {
    console.error('获取登录信息失败:', error)
    return null
  }
}

// 设置登录信息
export const setLoginInfo = (loginInfo: LoginInfo): void => {
  try {
    Taro.setStorageSync('login_info', loginInfo)
  } catch (error) {
    console.error('存储登录信息失败:', error)
  }
}

// 清除登录信息
export const clearLoginInfo = (): void => {
  try {
    Taro.removeStorageSync('login_info')
  } catch (error) {
    console.error('清除登录信息失败:', error)
  }
}

// 检查登录信息是否有效
export const isLoginValid = (): boolean => {
  const loginInfo = getLoginInfo()
  if (!loginInfo) return false
  
  const now = Date.now()
  return now < loginInfo.expires
}

// 获取有效的登录token
export const getValidLoginToken = (): string | null => {
  if (!isLoginValid()) {
    return null
  }
  
  const loginInfo = getLoginInfo()
  return loginInfo?.token || null
}

// 获取用户信息
export const getUserInfo = (): any => {
  const loginInfo = getLoginInfo()
  return loginInfo?.userInfo || null
}

// 执行登录并存储结果
export const loginAndStore = async (): Promise<boolean> => {
  try {
    const res = await Taro.cloud.callContainer({
      path: '/login',
      method: 'GET',
      header: {
        'X-WX-SERVICE': 'emh-platform-server',
      }
    })

    console.log('登录结果:', res)

    if (res.statusCode === 200 && res.data) {
      setLoginInfo({
        userInfo: res.data.userInfo,
        token: res.data.token,
        timestamp: Date.now(),
        expires: res.data.expires || Date.now() + 24 * 60 * 60 * 1000,
      })
      console.log('登录信息已存储到本地')
      return true
    } else {
      console.error('登录失败:', res)
      return false
    }
  } catch (error) {
    console.error('登录请求失败:', error)
    return false
  }
}

// 刷新登录信息
export const refreshLogin = async (): Promise<boolean> => {
  return await loginAndStore()
} 