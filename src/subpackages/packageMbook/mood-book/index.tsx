import { useState, useRef, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { useAppSelector } from '@/store'
import { MoodListMonthData } from '@/store/moods';


import MoodCalendarSummary from '@components/MoodCalendarSummary';
import PageHeader from '@components/PageHeader';

import './index.less';

const pages = Array.from({ length: 12 }).map((_, i) => ({
  // title: `Page${i + 1}`,
  content: `第${i + 1}页内容`
}));

export default function BookFlip() {
  const [pairIndex, setPairIndex] = useState(0); // 当前左页索引，默认从第0页开始
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipPercent, setFlipPercent] = useState(0);
  const [currentYear, setCurrentYear] = useState(2025);
  const [bookData, setBookData] = useState<MoodListMonthData | null>(null);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right' | null>(null);
  const touchStartX = useRef(0);

  const moodlist = useAppSelector((state) => state.mood.moodList);

  // 组件加载时获取情绪数据
  useEffect(() => {
    const result = moodlist.data
 
    setBookData(result);
  }, [moodlist]);



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
    if (moveX < 0 && pairIndex < pages.length - 1) {
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
      const deg = -180 + (flipPercent * 180);
      return {
        transform: `rotateY(${180 +deg}deg)`,
        zIndex: 3,
        transition: isFlipping || Math.abs(flipPercent) === 1 ? 'transform 0.5s' : 'none',
      };
    }
    if(!isFlipping && pairIndex === 0) {
      return {
        background: 'none'
      }
    }
    return { zIndex: 2 };
  };

  // 右页正反面内容
  const getRightFrontContent = () => {
    if (pairIndex === 0) {
      return <View className='book-flip'><Text className="book-year">2025</Text></View>;
    }
    return (
      <View className='book-flip'>
        {/* <Text className="book-title">{pages[pairIndex + 1]?.title || ''}</Text> */}
        {/* <Text className="book-content">{pages[pairIndex + 1]?.content || ''}</Text> */}
        {/* 2222222 */}
        <MoodCalendarSummary bookData={bookData?.[pairIndex]} month={pairIndex} year={currentYear}/>
      </View>
    );
  };


  // 左页正反面内容
  const getLeftFrontContent = () => {
    return (
      <>
        {/* <Text className="book-title">{pages[pairIndex]?.title || ''}</Text> */}
        <Text className="book-content">{pages[pairIndex]?.content || ''}</Text>
      </>
    );
  };


  // 右侧静态页（翻动时显示pairIndex+3）
  const getStaticRightContent = () => {
    if (flipDirection === 'left') {
      return (
        <View 
          className="book-page book-page-static book-page-right-static"
        >
          {/* 11111 */}
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
        <View
          className="book-page book-page-static book-page-left-static"
        >
          <MoodCalendarSummary bookData={bookData?.[pairIndex]} month={pairIndex+1} year={currentYear}/>
        </View>
      );
    }
    return null;
  };

  return (
    <View className="book-bg">
      <PageHeader title="心情日记" />
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
        <View className="book-page book-page-left" style={pairIndex === 0 ? { background: 'none' } : getLeftPageStyle()}>
          <View className="book-face book-face-front">{getLeftFrontContent()}</View>
          {/* <View className="book-face book-face-back">{getLeftBackContent()}</View> */}
        </View>
        {/* 右页（正反面） */}
        <View className={`book-page ${(!isFlipping && pairIndex === 0) ? 'book-page-cover' : 'book-page-right'}`} style={getRightPageStyle()}>
          <View className="book-face book-face-front">{getRightFrontContent()}</View>
          {/* <View className="book-face book-face-back">{getRightBackContent()}</View> */}
        </View>
        {/* 绿色中轴线 */}
        {/* <View className="book-center-line" /> */}
      </View>
    </View>
  );
}