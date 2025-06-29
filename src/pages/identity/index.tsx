import { View, Progress } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.less'


// 授权手机号，需要是商业号
export default function Identity () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
       <View className='components-page'>
        <Progress percent={50} showInfo strokeWidth={2} />
        <Progress percent={100} strokeWidth={2} active />

      </View>
      <View>目前你是什么身份？</View>
      


      <View>现在！就现在！情绪如何？</View>

      
      I got it！很高兴认识你！
      
    </View>
  )
}
