import { View, Image } from '@tarojs/components'
import { FC } from 'react'
import './index.less'

interface GreetingProps {
  firstLine: string
  secondLine: string
  avatar?: string
}

const Greeting: FC<GreetingProps> = ({ firstLine, secondLine, avatar }) => {
  return (
    <>
      <View className='greeting-container'>
        <View className='greeting'>
          <View className='greeting__content'>
            <View className='greeting__first-line'>{firstLine}</View>
            <View className='greeting__second-line'>{secondLine}</View>
          </View>
          {avatar && (
            <View className='greeting__avatar'>
              <Image className='greeting__avatar-img' src={avatar} />
            </View>
          )}
        </View>
      </View>
        <View className='divider'></View>
      </>
  )
}

export default Greeting 