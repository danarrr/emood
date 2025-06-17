import { View, Image } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import Greeting from '../../components/Greeting'
import './index.less'

const catList = [
  { name: '委屈猫猫', img: 'https://placekitten.com/200/200?image=1', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { name: '委屈猫猫', img: 'https://placekitten.com/200/200?image=2', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { name: '委屈猫猫', img: 'https://placekitten.com/200/200?image=1', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { name: '委屈猫猫', img: 'https://placekitten.com/200/200?image=2', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { name: '委屈猫猫', img: 'https://placekitten.com/200/200?image=1', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { name: '委屈猫猫', img: 'https://placekitten.com/200/200?image=2', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
]

export default function EmojiList () {
  useLoad(() => {
    console.log('Page loaded.')
  })
  const [showModal, setShowModal] = useState(false)
  const [modalCat, setModalCat] = useState<any>(null)

  const handleShowModal = (cat) => {
    setModalCat(cat)
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
        {catList.map((cat, idx) => (
          <View className='emoji-list__item' key={idx} onClick={() => handleShowModal(cat)}>
            <View className=''>
              <Image className='emoji-list__img' src={cat.img} />
            </View>
            <View className='emoji-list__name'>{cat.name}</View>
          </View>
        ))}
      </View>
      {/* 弹窗 */}
      {showModal && modalCat && (
        <View className='emoji-list__modal-mask' onClick={() => setShowModal(false)}>
          <View className='emoji-list__modal' onClick={e => e.stopPropagation()}>
            <View className='emoji-list__modal-close' onClick={() => setShowModal(false)}>×</View>
            <View className='emoji-list__modal-top'>
              <Image className='emoji-list__modal-img' src={modalCat.img} />
            </View>
            <View className='emoji-list__modal-info'>
              <View className='emoji-list__modal-name'>{modalCat.name}</View>
              <View className='emoji-list__modal-desc'>{modalCat.desc}</View>
            </View>
            <View className='emoji-list__modal-emojis'>
              {Array.from({length: 12}).map((_, i) => (
                <Image className='emoji-list__modal-emoji' src={modalCat.img} key={i} />
              ))}
            </View>
            <View className='emoji-list__modal-btn'>￥9.9 立即购买</View>
          </View>
        </View>
      )}
    </View>
  )
}
