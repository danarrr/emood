import { useState, useEffect, useRef } from 'react'
import { View, Image, Swiper, SwiperItem } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAppDispatch, useAppSelector } from '@/store'

import { getMoodListAction } from '@/store/moods/actions'
import { getUserInfoAction } from '@/store/user/actions'

import Turntable from './components/Turntable'
import Calendar from '@components/Calendar'
import Greeting from '@/components/Greeting'

import { getFestivalBgImage, getGreetingTxt } from '@/utils/festivalSetting'
import { getNowDateInfo } from '@utils/date'

import avatar from '@imgs/face@2x-3.png'
import userCenter from '@imgs/icon-mine@2x.png'
import book from '@imgs/icon-god@2x.png'
import addPlus from '@imgs/icon-new@2x.png'
import maskTitle from '@imgs/pic-txt@2x.png'

import './index.less'

interface MonthInfo {
  month: string;
  year: string;
  date: string;
}

export default function MoodRecord () {
  const dispatch = useAppDispatch();
  const moodList = useAppSelector((state) => state.mood.moodList);
  const userInfo = useAppSelector(state => state.user.userInfo)
  const turntableRef = useRef<any>();

  const [showMask, setShowMask] = useState<boolean>(false)
  const [currentMonthInfo, setCurrentMonthInfo] = useState<MonthInfo>({ 
    month: getNowDateInfo().month,
    year: getNowDateInfo().year, 
    date: getNowDateInfo().date
  });
  const [showMaskDate, setShowMaskDate] = useState<MonthInfo>(currentMonthInfo)
  const [currentDialogue, setCurrentDialogue] = useState(getGreetingTxt());

  // 获取用户信息
  const getUserInfo = async () => {
    dispatch(getUserInfoAction())
  }

  // 获取情绪列表
  const getMoodList = async (data: { year: number }) => {
    dispatch(getMoodListAction({ data }))
  }
  
  // 组件加载时获取情绪数据
  useEffect(() => {
    // if (moodList.status === DataStatus.INITIAL) {
      getUserInfo();
      getMoodList({ year: +currentMonthInfo.year }); // 不用传userID, jwt直接验签？ @bapeLin
    // }
  }, []);


  useEffect(() => {
    setCurrentDialogue(getGreetingTxt(userInfo?.data?.birthdayMonth))
  }, [!!userInfo?.data?.birthdayMonth])

  // 路由跳转
  const goTo = (route: string, data?: any) => {
    Taro.vibrateShort({ type: 'light' });
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

  // 调用 Turntable 子组件方法
  const handleMaskTouchMove = (e: any) => {
    turntableRef.current?.handleTouchMove?.(e);
  };
  const handleMaskTouchStart = (e: any) => {
    turntableRef.current?.handleTouchStart?.(e);
  }

  // 处理月份切换
  const handleMonthChange = (e: { detail: { current: number } }) => {
    const { current } = e.detail;
    const monthNumber = current + 1; // current 从 0 开始，所以加 1
    const yearNumber = parseInt(currentMonthInfo.year, 10);
    setCurrentMonthInfo({
      month: monthNumber.toString(),
      year: yearNumber.toString(),
      date: currentMonthInfo.date
    });
  }

  // 生成 12 个月的日历组件
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
            emojiData={moodList?.data?.[month] || {}}
          />
        </SwiperItem>
      );
    }
    return items;
  }

  // 选择日期后显示蒙层
  const handleSetShowMaskDate = (date: MonthInfo) => {
    setShowMaskDate(date)
    handleOpenSltMoodMask()
  }

  // 打开蒙层
  const handleOpenSltMoodMask = () => {
    Taro.vibrateShort()
    setShowMask(true)
  }

  return (
    <View className='mood' style={{ background: `url(${getFestivalBgImage(userInfo?.data?.birthdayMonth)}) no-repeat center top / cover` }}>
      {/* 顶部栏 */}
      <View className='mood-header'>
        <View className='mood-header__date'>
          <View className='mood-header__month'>{currentMonthInfo.month}月</View>
          <View className='mood-header__year'>{currentMonthInfo.year}年</View>
        </View>
      </View>
      {/* 问候和头像 */}
      <Greeting
        firstLine={currentDialogue.hello}
        secondLine={currentDialogue.question}
        avatar={avatar}
      />
      {/* Calendar with Swiper */}
      <Swiper
        className='mood-swiper'
        current={Math.max(0, parseInt(currentMonthInfo.month, 10) - 1)}
        onChange={handleMonthChange}
      >
        {renderCalendarItems()}
      </Swiper>
      {/* 蒙层弹窗 */}
      {showMask && (
        <View
          className='mood-mask'
          onClick={() => setShowMask(false)}
          onTouchMove={handleMaskTouchMove}
          onTouchStart={handleMaskTouchStart}
        >
          <View><Image className='mood-mask__title' src={maskTitle} /></View>
          <View className='mood-mask__content'>
            <Turntable
              ref={turntableRef}
              onSelect={sltMood => {
                goTo('/pages/mood-detail/index', {
                  mood: sltMood,
                  date: JSON.stringify(showMaskDate)
                })
              }}
            />
          </View>
        </View>
      )}
      {/* 底部导航 */}
      <View className='mood-tabbar'>
        <View className='mood-tabbar__item' onClick={() => goTo('/pages/user-center/index')}>
          <Image className='mood-tabbar__icon' src={userCenter} />
        </View>
        <View className='mood-tabbar__item mood-tabbar__item--center' onClick={handleOpenSltMoodMask}>
          {/* <View className='mood-tabbar__plus'>＋</View> */}
          <Image className='mood-tabbar__plus' src={addPlus} />
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
