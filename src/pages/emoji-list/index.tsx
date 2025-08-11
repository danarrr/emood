import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { useAppSelector, useAppDispatch } from '@/store';
import { getUserInfoAction } from '@/store/user/actions';
import PageHeader from '@components/PageHeader'
import Greeting from '@components/Greeting'
import { domin, sign } from '@/utils/emojiMaps';
import { cloudRequest } from '@/utils/request'


import './index.less'


const skinOptions = [
  { key:'all', name: '大人不做选择', desc: '一次购买永久享有所有表情包', price: '29.9' },
  { key:'emoji1', name: 'emoji', img: domin + '/emoji1/d.png?', desc: '记录你的心情~', price: '6.9' },
  { key:'emoji2', name: '快乐小狗', img: domin + '/emoji2/d.png?' + sign, desc: '快乐小狗记录你的快乐~', price: '6.9' },
  { key:'emoji3', name: '美丽宝妈', img: domin + '/emoji3/a.png?', desc: '宝妈的日常，有欢乐有抓马~', price: '6.9' },
  { key:'emoji4', name: '牛马', img:  domin + '/emoji4/d.png?', desc: '上班~加班~上班~加班，什么时候轮到我休息呀', price: '6.9'  },
  { key:'emoji5', name: '女生', img:  domin + '/emoji5/d.png?', desc: '女生专属表情包，记录你的小情绪~', price: '6.9'  },
  { key:'emoji6', name: '怪蜀黍', img:  domin + '/emoji6/d.png?', desc: '怪蜀黍专属表情包，记录你的小情绪~', price: '6.9'  },
]

export default function EmojiList () {
  const [showModal, setShowModal] = useState(false)
  const [previewEmojis, setPreviewEmojis] = useState<any[]>([])
  const [modalItem, setModalItem] = useState('');
  const [hasSkinList, setSkinList] = useState<string[]>([])
  const userInfo = (useAppSelector((state) => state.user.userInfo?.data) || {}) as Record<string, any>;
  const dispatch = useAppDispatch();

  const handleShowModal = (item) => {
    Taro.vibrateShort({
      type: 'light'
    });
    // 生成 a-i 的 9 个表情
    const arr = Array.from({ length: 9 }, (_, i) => {
      const char = String.fromCharCode(97 + i) // 97 是 'a'
      return {
        img: `${domin}/${item.key}/${char}.png?${sign}`,
        key: char,
        name: item.name,
        desc: item.desc
      }
    })
    setPreviewEmojis(arr)
    setModalItem(item.key)
    setShowModal(true)
  }

  

  const getHasSkinList = async() =>{
    if (!userInfo.userid) return;
    const { data } = await cloudRequest({
      path: '/skin/list', // 业务自定义路径和参数
      method: 'GET', // 根据业务选择对应方法
      data: {
        userId: userInfo.userid,
      }
    })
    setSkinList(data)
  }

  useEffect(() => {
    getHasSkinList();
  }, [userInfo.userid])


  const handlePay = async () => {
    // const result = await cloudRequest({
    //   path: '/skin/buy', // 业务自定义路径和参数
    //   method: 'POST', // 根据业务选择对应方法
    //   data: {
    //     skin: modalItem,
    //     userId: userInfo.userid,
    //   }
    // })
    Taro.showToast({
      title: '正在施工中，需要添加客服🌏：13417008504',
      icon: 'none', // 不显示图标
      duration: 5000 // 显示时长，单位 ms
    })
  }

  // 切换皮肤
  const handleSetSkin = async () => {
    if (!userInfo.userid) return;
    await cloudRequest({
      path: '/account/user-info',
      method: 'PUT',
      data: { userId: userInfo.userid, currentSkin: modalItem }
    });
    await dispatch(getUserInfoAction());
    Taro.showToast({ title: '已切换为当前皮肤', icon: 'none' });
    setShowModal(false);
  };

  // 优化皮肤按钮渲染逻辑
  const renderSkinButton = () => {
    if (userInfo?.currentSkin === modalItem) {
      return <View className='emoji-list__modal-btn'>正在使用的皮肤</View>;
    }
    if (Array.isArray(hasSkinList) && (hasSkinList.includes(modalItem) || hasSkinList.includes('all'))) {
      return <View className='emoji-list__modal-btn' onClick={handleSetSkin}>设为当前皮肤</View>;
    }
    const price = skinOptions.find(c => c.key === modalItem)?.price || '6.9';
    return <View className='emoji-list__modal-btn' onClick={handlePay}>￥{price} 立即购买</View>;
  };
  return (
    <View className='emoji-list' >
      {/* 顶部导航 */}
      <PageHeader title='我的' />
      <Greeting
        firstLine="让你的日记~"
        secondLine="有更丰富的情绪"
      />
      <View className='emoji-list__grid'>
        {skinOptions.map((item, idx) => (
          <View className='emoji-list__item' key={idx} onClick={() => handleShowModal(item)}>
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
      {showModal && previewEmojis.length > 0 && (
        <View className='emoji-list__modal-mask' onClick={() => setShowModal(false)}>
          <View className='emoji-list__modal' onClick={e => e.stopPropagation()}>
            <View className='emoji-list__modal-close' onClick={() => {
              Taro.vibrateShort({ type: 'light' });
              setShowModal(false);
            }}>×</View>
            <View className='emoji-list__modal-top'>
              {modalItem === 'all' ? (
                <Text className='emoji-list__modal-all-text'>ALL</Text>
              ) : (
                <Image className='emoji-list__modal-img' src={previewEmojis[0].img} />
              )}
            </View>
            <View className='emoji-list__modal-info'>
              <View className='emoji-list__modal-name'>{previewEmojis[0].name}</View>
              <View className='emoji-list__modal-desc'>{previewEmojis[0].desc}</View>
            </View>
            <View className='emoji-list__modal-emojis'>
              {previewEmojis.map((item, i) => (
                <Image className='emoji-list__modal-emoji' src={item.img} key={item.key} />
              ))}
            </View>
            {/* 皮肤按钮逻辑 */}
            {renderSkinButton()}
          </View>
        </View>
      )}
    </View>
  )
}
