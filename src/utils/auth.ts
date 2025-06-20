import Taro from '@tarojs/taro'

// 鉴权信息接口
interface AuthInfo {
  token: string
  timestamp: number
  expires: number
}

// 获取鉴权信息
export const getAuthInfo = (): AuthInfo | null => {
  try {
    return Taro.getStorageSync('cloud_auth')
  } catch (error) {
    console.error('获取鉴权信息失败:', error)
    return null
  }
}

// 设置鉴权信息
export const setAuthInfo = (authInfo: AuthInfo): void => {
  try {
    Taro.setStorageSync('cloud_auth', authInfo)
  } catch (error) {
    console.error('存储鉴权信息失败:', error)
  }
}

// 清除鉴权信息
export const clearAuthInfo = (): void => {
  try {
    Taro.removeStorageSync('cloud_auth')
  } catch (error) {
    console.error('清除鉴权信息失败:', error)
  }
}

// 检查鉴权信息是否有效
export const isAuthValid = (): boolean => {
  const authInfo = getAuthInfo()
  if (!authInfo) return false
  
  const now = Date.now()
  return now < authInfo.expires
}

// 获取有效的鉴权token
export const getValidToken = (): string | null => {
  if (!isAuthValid()) {
    return null
  }
  
  const authInfo = getAuthInfo()
  return authInfo?.token || null
}

// 刷新鉴权信息
export const refreshAuth = async (): Promise<boolean> => {
  try {
    const token = Taro.getStorageSync('authorization')?.token
    const authResult = await Taro.cloud.callContainer({
      path: '/auth/get',
      method: 'GET',
      header: {
        'X-WX-SERVICE': 'emh-platform-server',
        'authorization': token
      },
    })

    if (authResult.statusCode === 200 && authResult.data) {
      setAuthInfo({
        token: authResult.data.token,
        timestamp: Date.now(),
        expires: authResult.data.expires || Date.now() + 24 * 60 * 60 * 1000,
      })
      return true
    }
    return false
  } catch (error) {
    console.error('刷新鉴权信息失败:', error)
    return false
  }
} 