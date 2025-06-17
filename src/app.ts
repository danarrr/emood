import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './app.less'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
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

  Taro.cloud.init({
    env: 'prod-6glre6n1cad02d9f',
    traceUser: true,
  })

  
  return children
}
  


export default App
