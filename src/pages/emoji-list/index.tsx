import { View, Image, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@/store';
import PageHeader from '@components/PageHeader'
import Greeting from '@components/Greeting'
import { domin, sign } from '@/utils/constants';
import { cloudRequest } from '@/utils/request'

import './index.less'


const catList = [
  { key:'all', name: '大人不做选择', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { key:'emoji1', name: 'emoji', img: domin + '/emoji1/d.png?', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { key:'emoji2', name: '快乐小狗', img: domin + '/emoji2/d.png?' + sign, desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { key:'emoji3', name: '美丽宝妈', img: domin + '/emoji3/a.png?', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { key:'emoji4', name: '牛马', img:  domin + '/emoji4/d.png?', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { key:'emoji5', name: '女生', img:  domin + '/emoji5/d.png?', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
  { key:'emoji6', name: '怪蜀黍', img:  domin + '/emoji6/d.png?', desc: '这里是一段表情包的简介，这里是一段表情包的简介。' },
]

export default function EmojiList () {
  const [showModal, setShowModal] = useState(false)
  const [modalCat, setModalCat] = useState<any[]>([])
  const [modalItem, setModalItem] = useState('');
  const [hasSkinList, setSkinList] = useState(null)
  const userInfo = useAppSelector((state) => state.user.userInfo?.data);

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
    setModalItem(item)
    setShowModal(true)
  }

  

  const getHasSkinList = async() =>{
    const { data } = await cloudRequest({
      path: '/skin/list', // 业务自定义路径和参数
      method: 'GET', // 根据业务选择对应方法
      data: {
        userId: userInfo.userid,
      }
    })
    setSkinList(data.data)
  }

  useEffect(() => {
    getHasSkinList();
  }, [userInfo.userid])


  const handlePay = async () => {
    const result = await cloudRequest({
      path: '/skin/buy', // 业务自定义路径和参数
      method: 'POST', // 根据业务选择对应方法
      data: {
        skin: modalItem,
        userId: userInfo.userid,
      }
    })
    Taro.showToast({
      title: '正在施工中，需要添加客服：🌏danarrr',
      icon: 'none', // 不显示图标
      duration: 5000 // 显示时长，单位 ms
    })
  }

  return (
    <View className='emoji-list' >
      {/* 顶部导航 */}
      <PageHeader title='我的' />
      <Greeting
        firstLine="让你的日记~"
        secondLine="有更丰富的情绪"
      />
      <View className='emoji-list__grid'>
        {catList.map((item, idx) => (
          <View className='emoji-list__item' key={idx} onClick={() => handleShowModal(item.key)}>
            <View className='emoji-list__item-bg'>
              <View className='emoji-list__item-img-box'>
                {item.img ? <Image className='emoji-list__item-img' src={item.img} />:
                <Text>ALL</Text>
                }
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
            {
              (hasSkinList?.includes(modalItem) || hasSkinList?.includes('all')) ? <View className='emoji-list__modal-btn'>您已拥有</View> : 
              <View className='emoji-list__modal-btn' onClick={handlePay}>￥9.9 立即购买</View>
            }
            
          </View>
        </View>
      )}
    </View>
  )
}
