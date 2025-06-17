import { View, Button, Progress } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.less'

export default function Identity () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      AI分析周报
      点击分析 - 最小维度为周分析 （按周分析）；
        - 分析结果，和建议。
      日历列表 - 按年份 12个月记录，会记录每个月成果。  
    </View>
  )
}
