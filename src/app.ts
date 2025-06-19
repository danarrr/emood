import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { loginAndStore, isLoginValid } from './utils/login'
import './app.less'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
    
    // 初始化云开发
    Taro.cloud.init({
      env: 'prod-6glre6n1cad02d9f',
      traceUser: true,
    })

    // 检查并执行登录
    const initLogin = async () => {
      if (!isLoginValid()) {
        console.log('登录信息无效或过期，正在重新登录...')
        const success = await loginAndStore()
        if (success) {
          console.log('登录成功，信息已存储')
        } else {
          console.error('登录失败')
        }
      } else {
        console.log('登录信息有效')
      }
    }

    // 启动时执行登录
    initLogin()
    
    // Taro.loadFontFace({
    //   family: 'AlibabaPuHuiTi',
    //   global: true,
    //   source: 'url("@utils/font/AlibabaPuHuiTi-2-75-SemiBold.ttf")',  //此处需替换为真实字体地址
    //   success(res) {
    //     console.log(res.status)
    //   },
    //   fail: function (res) {
    //     console.log(res.status)
    //   },
    //   complete: function (res) {
    //     console.log(res.status)
    //   }
    // });
  })

  return children
}

export default App
