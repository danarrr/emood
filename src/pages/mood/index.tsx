import { View, Image, Swiper, SwiperItem } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'

import { DataStatus } from '@/store/interface'
import { getMoodListAction } from '@/store/moods/actions'
import { getUserInfoAction } from '@/store/user/actions'

import Turntable from './components/Turntable'
import Calendar from '@components/Calendar'
import Greeting from '@/components/Greeting'

import { getFestivalBgImage, getGreetingTxt } from '@/utils/festivalSetting'

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


export default function MoodRecord () {
  const dispatch = useAppDispatch();
  const moodlist = useAppSelector((state) => state.mood.moodList);
  useLoad(() => {
    console.log('Page loaded.')
  })

  const turntableRef = useRef();
  const [showMask, setShowMask] = useState(false)
  const [currentMonthInfo, setCurrentMonthInfo] = useState({ 
    month: new Date().getMonth() + 1 + '', // 当前月份（0-11，需要+1）
    year: new Date().getFullYear() + '', // 当前年份
    date: new Date().getDate() + '' // 当前日期
  });
  const [showMaskDate, setShowMaskDate] = useState(currentMonthInfo)
  const [currentDialogue, setCurrentDialogue] = useState(getGreetingTxt());

  const getUserInfo = async() => {
    dispatch(getUserInfoAction())
  }
  const getMoodList = async(data) => {
    const token = Taro.getStorageSync('authorization')?.token
    if (!token) {return};
    dispatch(getMoodListAction({data, token}))
  }
  

  // 组件加载时获取情绪数据
  useEffect(() => {
    getUserInfo();
    if (moodlist.status === DataStatus.INITIAL) {
      getMoodList({year: currentMonthInfo.year});
    }
  }, []);

  const goTo = (route: string, data?: any) => {
    Taro.vibrateShort({
      type: 'light'
    });
    const url = data 
      ? `${route}?${Object.entries(data)
          .map(([key, value]) => {
            // 如果值是对象，需要先序列化
            const paramValue = typeof value === 'object' 
              ? encodeURIComponent(JSON.stringify(value))
              : encodeURIComponent(String(value));
            return `${key}=${paramValue}`;
          })
          .join('&')}`
      : route;
      
    Taro.navigateTo({ url });
  }

  const handleMaskTouchMove = (e) => {
    // 调用子组件方法
    turntableRef.current?.handleTouchMove(e);
  };

  const handleMaskTouchStart = (e) => {
    turntableRef.current?.handleTouchStart(e);
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
            handleSltMood={handleSetShowMaskDate}
            emojiData={moodlist?.data? moodlist?.data[month] : {}}
          />
        </SwiperItem>
      );
    }
    
    return items;
  }

  const handleSetShowMaskDate = (date) => {
    setShowMaskDate(date)
    handleOpenSltMoodMask()
  }

  const handleOpenSltMoodMask = () => {
    Taro.vibrateShort()
    setShowMask(true)
  }

  return (
    <View className='mood' style={{background: `url(${getFestivalBgImage()}) no-repeat center top / cover`}}>  
    {/* 顶部栏 */}
      <View className='mood-header'>
        <View className='mood-header__date'>
          <View className='mood-header__month'>
            {currentMonthInfo.month}月
          </View>
          <View className='mood-header__year'>{currentMonthInfo.year}年</View>
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
        {Object.values(moodlist).map((emojiName) => (
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
        <View className='mood-mask'
          // catchTouchMove
          onClick={() => setShowMask(false)} 
          onTouchMove={handleMaskTouchMove}
          onTouchStart={handleMaskTouchStart}
        >
          <View><Image className='mood-mask__title' src={masktitle}/></View>
          <View className='mood-mask__content'>
            <Turntable 
              ref={turntableRef}
              onSelect={sltMood =>{
                goTo('/pages/mood-detail/index', {
                mood: sltMood,
                date: JSON.stringify(showMaskDate) // 先序列化对象
              })}}
            ></Turntable>
          </View>
        </View>
      )}
      {/* 底部导航 */}
      <View className='mood-tabbar'>
        <View className='mood-tabbar__item' onClick={() => goTo('/pages/user-center/index')}>
          <Image className='mood-tabbar__icon' src={usercenter} />
        </View>
        <View className='mood-tabbar__item mood-tabbar__item--center' onClick={handleOpenSltMoodMask}>
          <View className='mood-tabbar__plus'>＋</View>
        </View>
        <View
          className='mood-tabbar__item'
          onClick={() => goTo('/subpackages/packageMbook/mood-book/index')}
        >
          <Image className='mood-tabbar__icon' src={book} />
        </View>
      </View>
    </View>
  )
}
