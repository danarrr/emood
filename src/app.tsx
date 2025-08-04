import { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'
import { Provider } from 'react-redux';
import store from './store';
import { loginAndStore, isLoginValid } from './utils/login'
import GlobalVibrateContainer from './hooks/useVibration'


import './app.less'


if (typeof AbortController === 'undefined') {
  class AbortController {
    signal: any;
    constructor() {
      this.signal = {
        aborted: false,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      };
    }
    abort() {
      this.signal.aborted = true;
    }
  }
  (globalThis as any).AbortController = AbortController;
}

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
          // // 登录成功后重新跳转大
          // Taro.reLaunch({
          //   url: '/pages/mood/index'
          // });
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
    
    Taro.loadFontFace({
      family: 'AlibabaPuHuiTiBold',
      global: true,
      source: 'https://prod-6glre6n1cad02d9f-1363336642.tcloudbaseapp.com/AlibabaPuHuiTi-2-75-SemiBold.ttf?sign=dfa5e8ffa02389bf8706b84336bbf137&t=1751296279',  //此处需替换为真实字体地址
      success(res) {
        console.log(res.status)
      },
      fail: function (res) {
        console.log(res.status)
      },
      complete: function (res) {
        console.log(res.status)
      }
    });

    Taro.loadFontFace({
      family: 'AlibabaPuHuiTi',
      global: true,
      source: 'https://prod-6glre6n1cad02d9f-1363336642.tcloudbaseapp.com/AlibabaPuHuiTi-3-45-Light.ttf?sign=833194c25e80451833b1b2667bef5684&t=1751296309',  //此处需替换为真实字体地址
      success(res) {
        console.log(res.status)
      },
      fail: function (res) {
        console.log(res.status)
      },
      complete: function (res) {
        console.log(res.status)
      }
    });
  })
  return (
    <Provider store={store}>
      <GlobalVibrateContainer>
        {children}
      </GlobalVibrateContainer>
    </Provider>
    
  )
}

export default App
