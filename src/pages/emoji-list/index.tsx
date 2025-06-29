import { View, Image } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import PageHeader from '@components/PageHeader'
import Greeting from '@components/Greeting'
import { domin, sign } from '@/utils/constants';

import './index.less'

const catList = [
  { key:'emoji1', name: '委屈猫猫', img: 'https://placekitten.com/200/200?image=1', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { key:'emoji2', name: '快乐小狗', img: domin + '/emoji2/d.png?' + sign, desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { key:'emoji3', name: '宝妈', img: domin + '/emoji3/a.png?', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { key:'emoji4', name: '委屈猫猫', img: 'https://placekitten.com/200/200?image=2', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { key:'emoji5', name: '委屈猫猫', img: 'https://placekitten.com/200/200?image=1', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { key:'emoji6', name: '委屈猫猫', img: 'https://placekitten.com/200/200?image=2', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
]

export default function EmojiList () {
  useLoad(() => {
    console.log('Page loaded.')
  })
  const [showModal, setShowModal] = useState(false)
  const [modalCat, setModalCat] = useState<any[]>([])

  const handleShowModal = (item) => {
    // 生成 a-i 的 9 个表情
    const arr = Array.from({ length: 9 }, (_, i) => {
      const char = String.fromCharCode(97 + i) // 97 是 'a'
      return {
        img: `${domin}/${item}/${char}.png?${sign}`,
        key: char
      }
    })
    setModalCat(arr)
    setShowModal(true)
  }

  const goBack = () => {
    Taro.navigateBack()
  }

  return (
    <View className='emoji-list'>
      {/* 顶部导航 */}
      <PageHeader goBack={goBack} title='我的' />
      <Greeting
        firstLine="让你的日记~"
        secondLine="有更丰富的情绪"
      />
      <View className='emoji-list__grid'>
        {catList.map((item, idx) => (
          <View className='emoji-list__item' key={idx} onClick={() => handleShowModal(item.key)}>
            <View className='emoji-list__item-bg'>
              <View className='emoji-list__item-img-box'>
                <Image className='emoji-list__item-img' src={item.img} />
              </View> 
            </View>
            <View className='emoji-list__item-name'>{item.name}</View>
          </View>
        ))}
      </View>
      {/* 弹窗 */}
      {showModal && modalCat.length > 0 && (
        <View className='emoji-list__modal-mask' onClick={() => setShowModal(false)}>
          <View className='emoji-list__modal' onClick={e => e.stopPropagation()}>
            <View className='emoji-list__modal-close' onClick={() => setShowModal(false)}>×</View>
            <View className='emoji-list__modal-top'>
              <Image className='emoji-list__modal-img' src={modalCat[0].img} />
            </View>
            <View className='emoji-list__modal-info'>
              <View className='emoji-list__modal-name'>9种表情</View>
              <View className='emoji-list__modal-desc'>a-i九种表情展示</View>
            </View>
            <View className='emoji-list__modal-emojis'>
              {modalCat.map((item, i) => (
                <Image className='emoji-list__modal-emoji' src={item.img} key={item.key} />
              ))}
            </View>
            <View className='emoji-list__modal-btn'>￥9.9 立即购买</View>
          </View>
        </View>
      )}
    </View>
  )
}
