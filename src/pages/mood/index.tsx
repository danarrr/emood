import { View, Image, Swiper, SwiperItem } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import Turntable from './components/Turntable'
import Calendar from '@components/Calendar'
import Greeting from '@/components/Greeting'

import avater from '@imgs/face@2x-3.png'
import usercenter from '@imgs/icon-mine@2x.png'
import book from '@imgs/icon-god@2x.png'
import masktitle from '@imgs/pic-txt@2x.png';


import './index.less'

// 定义情绪类型
interface MoodEmoji {
  id: number;
  emoji: string;
  name: string;
}

// Define possible dialogue options
const dialogueOptions = [
  { hello: 'Hello~', question: '今天过得怎样？' },
  // Add more dialogue options here if needed
  // { hello: '你好!', question: '有什么想分享的吗?' },
  // { hello: 'Hi!', question: 'How was your day?' },
];

export default function MoodRecord () {
  useLoad(() => {
    console.log('Page loaded.')
  })
  
  const [showMask, setShowMask] = useState(false)
  const [currentMonthInfo, setCurrentMonthInfo] = useState({ 
    month: new Date().getMonth() + 1 + '', // 当前月份（0-11，需要+1）
    year: new Date().getFullYear() + '', // 当前年份
    date: new Date().getDate() + '' // 当前日期
  });
  const [currentDialogue, setCurrentDialogue] = useState(dialogueOptions[0]);
  const [moodEmojis, setMoodEmojis] = useState<MoodEmoji[]>([]);

  const getMoodList = async(data) => {
    const token = Taro.getStorageSync('authorization')?.token
    return await Taro.cloud.callContainer({
      data,
      path: '/mood/list', // 填入业务自定义路径和参数，根目录，就是 / 
      method: 'GET', // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': 'emh-platform-server', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        'authorization': token
      }
    })
  }

  // 获取情绪 emoji 数据
  const fetchMoodEmojis = async () => {
    try {
      // const data = await http.get<MoodEmoji[]>(API.mood.list);
      const result = await getMoodList({year: currentMonthInfo.year})
      setMoodEmojis(result.data?.data);
    } catch (error) {
      // console.error('获取心情表情失败:', error);
      // // 设置默认值
      // setMoodEmojis([
      //   { id: 1, emoji: '😊', name: '开心' },
      //   { id: 2, emoji: '😢', name: '难过' },
      //   { id: 3, emoji: '😡', name: '生气' },
      //   { id: 4, emoji: '😴', name: '疲惫' },
      // ]);
    }
   
  };

  // 组件加载时获取情绪数据
  useEffect(() => {
    fetchMoodEmojis();
  }, []);

  const goTo = (route: string, data?: any) => {
    const url = data 
      ? `/pages/${route}/index?${Object.entries(data)
          .map(([key, value]) => {
            // 如果值是对象，需要先序列化
            const paramValue = typeof value === 'object' 
              ? encodeURIComponent(JSON.stringify(value))
              : encodeURIComponent(String(value));
            return `${key}=${paramValue}`;
          })
          .join('&')}`
      : `/pages/${route}/index`;
      
    Taro.navigateTo({ url });
  }

  // 处理月份切换
  const handleMonthChange = (e) => {
    const { current } = e.detail;
    const monthNumber = current + 1; // current 从 0 开始，所以加 1
    const yearNumber = parseInt(currentMonthInfo.year, 10);
    
    setCurrentMonthInfo({
      month: monthNumber.toString(),
      year: yearNumber.toString(),
      date: currentMonthInfo.date // 保持当前日期不变
    });
  }

  // 生成12个月的日历组件
  const renderCalendarItems = () => {
    const items: JSX.Element[] = [];
    const year = parseInt(currentMonthInfo.year, 10);
    
    for (let month = 1; month <= 12; month++) {
      items.push(
        <SwiperItem key={month}>
          <Calendar 
            year={year} 
            month={month} 
            emojiData={moodEmojis[month]}
          />
        </SwiperItem>
      );
    }
    
    return items;
  }

  return (
    <View className='mood'>
      {/* 顶部栏 */}
      <View className='mood-header'>
        <View className='mood-header__date'>
          <View className='mood-header__month'>
            {currentMonthInfo.month}月
          </View>
          <View className='mood-header__year'>{currentMonthInfo.year}</View>
        </View>
      </View>
      {/* 问候和头像 */}
      <Greeting
        firstLine={currentDialogue.hello}
        secondLine={currentDialogue.question}
        avatar={avater}
      />
      {/* <View className='mood-divider'></View> */}
      {/* emoji 选择 */}
      {/* <View className='mood-emojis'>
        {Object.values(moodEmojis).map((emojiName) => (
          <View  className='mood-emojis__item'>
            <Image 
              className='mood-emojis__img'
              src={emojiMap[emojiName]}
              mode='aspectFit'
            />
          </View>
        ))}
      </View> */}
      
      {/* Calendar with Swiper */}
      <Swiper
        className='mood-swiper'
        current={parseInt(currentMonthInfo.month, 10) - 1}
        onChange={handleMonthChange}
      >
        {renderCalendarItems()}
      </Swiper>
      
      {/* 蒙层弹窗 */}
      {showMask && (
        <View className='mood-mask' onClick={() => setShowMask(false)}>
          <View ><Image  className='mood-mask__title' src={masktitle}/></View>
          <View className='mood-mask__content'>
            <Turntable onSelect={sltMood =>{
              goTo('mood-detail', {
              mood: sltMood,
              date: JSON.stringify(currentMonthInfo) // 先序列化对象
            })}}></Turntable>
          </View>
        </View>
      )}
      {/* 底部导航 */}
      <View className='mood-tabbar'>
        <View className='mood-tabbar__item' onClick={() => goTo('user-center')}>
          <Image className='mood-tabbar__icon' src={usercenter} />
        </View>
        <View className='mood-tabbar__item mood-tabbar__item--center' onClick={() => {
          Taro.vibrateShort()
          setShowMask(true)}
        }>
          <View className='mood-tabbar__plus'>＋</View>
        </View>
        <View
          className='mood-tabbar__item'
          onClick={() => goTo('mood-book')}
        >
          <Image className='mood-tabbar__icon' src={book} />
        </View>
      </View>
    </View>
  )
}
