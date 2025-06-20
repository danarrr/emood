import React, { useState, useRef, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';

import MoodCalendarSummary from '@components/MoodCalendarSummary';
import PageHeader from '@components/PageHeader';

import './index.less';

const pages = Array.from({ length: 10 }).map((_, i) => ({
  // title: `Page${i + 1}`,
  content: `第${i + 1}页内容`
}));

export default function BookFlip() {
  const [pairIndex, setPairIndex] = useState(5); // 当前左页索引
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipPercent, setFlipPercent] = useState(0);
  const [currentYear, setCurrentYear] = useState(2025);
  const [bookData, setBookData] = useState(null)
  const [flipDirection, setFlipDirection] = useState<'left' | 'right' | null>(null);
  const touchStartX = useRef(0);


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

  // 组件加载时获取情绪数据
  useEffect(() => {
    fetchMoodEmojis();
  }, []);


  // 获取情绪 emoji 数据
  const fetchMoodEmojis = async () => {
    try {
      const result = await getMoodList({year: currentYear})
      setBookData(result.data?.data);
    } catch (error) {
      console.error('获取心情表情失败:', error);
    }
   
  };

  // 触摸开始
  const handleTouchStart = (e) => {
    if (isFlipping) return;
    touchStartX.current = e.touches[0].clientX;
    setFlipPercent(0);
  };

  // 触摸移动
  const handleTouchMove = (e) => {
    if (isFlipping) return;
    const moveX = e.touches[0].clientX - touchStartX.current;
    if (moveX < 0 && pairIndex < pages.length - 2) {
      setFlipDirection('left');
      setFlipPercent(Math.max(moveX / 300, -1));
    } else if (moveX > 0 && pairIndex > 0) {
      setFlipDirection('right');
      setFlipPercent(Math.min(moveX / 300, 1));
    }
  };

  // 触摸结束
  const handleTouchEnd = () => {
    if (isFlipping) return;
    if (flipDirection === 'left' && flipPercent < -0.3 && pairIndex < pages.length - 1) {
      setIsFlipping(true);
      setFlipPercent(-1);
      setTimeout(() => {
        setPairIndex(pairIndex + 1);
        setIsFlipping(false);
        setFlipPercent(0);
        setFlipDirection(null);
      }, 500);
    } else if (flipDirection === 'right' && flipPercent > 0.3 && pairIndex > 0) {
      setIsFlipping(true);
      setFlipPercent(1);
      setTimeout(() => {
        setPairIndex(pairIndex - 1);
        setIsFlipping(false);
        setFlipPercent(0);
        setFlipDirection(null);
      }, 500);
    } else {
      setFlipPercent(0);
      setFlipDirection(null);
    }
  };

  // 右页翻动动画
  const getRightPageStyle = () => {
    if (flipDirection === 'left') {
      const deg = flipPercent * 180;
      return {
        transform: `rotateY(${deg}deg)`,
        zIndex: 3,
        transition: isFlipping || Math.abs(flipPercent) === 1 ? 'transform 0.5s' : 'none',
      };
    }
    return { zIndex: 2 };
  };

  // 左页翻动动画
  const getLeftPageStyle = () => {
    if (flipDirection === 'right') {
      const deg = flipPercent * 180;
      return {
        transform: `rotateY(${180 + deg}deg)`,
        zIndex: 3,
        transition: isFlipping || Math.abs(flipPercent) === 1 ? 'transform 0.5s' : 'none',
      };
    }
    return { zIndex: 2 };
  };

  // 右页正反面内容
  const getRightFrontContent = () => (
    <View className='book-flip'>
      {/* <Text className="book-title">{pages[pairIndex + 1]?.title || ''}</Text> */}
      {/* <Text className="book-content">{pages[pairIndex + 1]?.content || ''}</Text> */}
      2222222
      <MoodCalendarSummary bookData={bookData?.[pairIndex]} month={pairIndex} year={currentYear}/>
    </View>
  );


  // 左页正反面内容
  const getLeftFrontContent = () => (
    <>
      {/* <Text className="book-title">{pages[pairIndex]?.title || ''}</Text> */}
      <Text className="book-content">{pages[pairIndex]?.content || ''}</Text>
    </>
  );


  // 右侧静态页（翻动时显示pairIndex+3）
  const getStaticRightContent = () => {
    if (flipDirection === 'left') {
      return (
        <View className="book-page book-page-static book-page-right-static">
          11111
          {/* <Text className="book-title">{pages[pairIndex + 3]?.title || ''}</Text> */}
          {/* <Text className="book-content">{pages[pairIndex + 3]?.content || ''}</Text> */}
          <MoodCalendarSummary bookData={bookData?.[pairIndex]} month={pairIndex+1} year={currentYear}/>
        </View>
      );
    }
    return null;
  };

  // 左侧静态页（翻动时显示pairIndex-2）
  const getStaticLeftContent = () => {
    if (flipDirection === 'right') {
      return (
        <View className="book-page book-page-static book-page-left-static">
          <MoodCalendarSummary bookData={bookData?.[pairIndex]} month={pairIndex+1} year={currentYear}/>
        </View>
      );
    }
    return null;
  };

  

  const goBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className="book-bg">
      <PageHeader goBack={goBack} title="心情日记" />
      <View className='book-title'>2025年</View>
      <View
        className="book-outer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 左侧静态页（翻右时出现） */}
        {getStaticLeftContent()}
        {/* 右侧静态页（翻左时出现） */}
        {getStaticRightContent()}

        {/* 左页（正反面） */}
        <View className="book-page book-page-left" style={getLeftPageStyle()}>
          <View className="book-face book-face-front">{getLeftFrontContent()}</View>
          {/* <View className="book-face book-face-back">{getLeftBackContent()}</View> */}
        </View>
        {/* 右页（正反面） */}
        <View className="book-page book-page-right" style={getRightPageStyle()}>
          <View className="book-face book-face-front">{getRightFrontContent()}</View>
          {/* <View className="book-face book-face-back">{getRightBackContent()}</View> */}
        </View>
        {/* 绿色中轴线 */}
        <View className="book-center-line" />
      </View>
    </View>
  );
}