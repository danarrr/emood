import { useState, useRef, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppSelector } from '@/store'
import { MoodListMonthData } from '@/store/moods';


import MoodCalendarSummary from '@components/MoodCalendarSummary';
import PageHeader from '@components/PageHeader';
import SlideHint from '@components/SlideHint';
import { cloudRequest } from '@/utils/request';

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
  const [yearAnalyses, setYearAnalyses] = useState<{[key: string]: any}>({});
  const [showSlideHint, setShowSlideHint] = useState(false);
  const touchStartX = useRef(0);

  const moodlist = useAppSelector((state) => state.mood.moodList);
  const userInfo = useAppSelector((state) => state.user.userInfo.data);

  // 缓存相关的常量
  const CACHE_KEY = 'mood_book_last_page';
  const CACHE_YEAR_KEY = 'mood_book_year';

  // 保存页面位置到缓存
  const savePageToCache = (pageIndex: number) => {
    try {
      Taro.setStorageSync(CACHE_KEY, pageIndex);
      Taro.setStorageSync(CACHE_YEAR_KEY, currentYear);
    } catch (error) {
      console.error('保存页面位置到缓存失败:', error);
    }
  };

  // 从缓存读取页面位置
  const getPageFromCache = (): number => {
    try {
      const cachedYear = Taro.getStorageSync(CACHE_YEAR_KEY);
      const cachedPage = Taro.getStorageSync(CACHE_KEY);
      
      // 如果是同一年且有缓存，返回缓存的页面位置
      if (cachedYear === currentYear && typeof cachedPage === 'number' && cachedPage >= 0 && cachedPage < pages.length) {
        console.log('从缓存恢复页面:', cachedPage, '年份:', cachedYear);
        return cachedPage;
      }
      // 如果不是同一年或没有缓存，返回0（首页）
      console.log('没有缓存或年份不匹配，返回首页');
      return 0;
    } catch (error) {
      console.error('从缓存读取页面位置失败:', error);
      return 0;
    }
  };

  // 清除缓存（用于调试）
  const clearCache = () => {
    try {
      Taro.removeStorageSync(CACHE_KEY);
      Taro.removeStorageSync(CACHE_YEAR_KEY);
      console.log('缓存已清除');
    } catch (error) {
      console.error('清除缓存失败:', error);
    }
  };

  // 组件初始化时从缓存读取页面位置
  useEffect(() => {
    const cachedPageIndex = getPageFromCache();
    setPairIndex(cachedPageIndex);
    console.log('从缓存恢复页面位置:', cachedPageIndex);
    
    // 检查是否需要显示滑动提示动画
      const moodBookLastPage = Taro.getStorageSync(CACHE_KEY);
      const shouldShowHint = !moodBookLastPage || moodBookLastPage === 0;
      
      if (shouldShowHint) {
        // 首次进入，显示滑动提示
        setShowSlideHint(true);
        // 自动隐藏滑动提示（8秒后）
        const timer = setTimeout(() => {
          setShowSlideHint(false);
        }, 4000);

        return () => clearTimeout(timer);
      }
  }, []);

  useEffect(() => {
    // getAnalyse()
    userInfo?.isMember && getMoodAnalyse()
  },[])

  const getMoodAnalyse = async() => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      
      const result = await cloudRequest({
        path: `/analyse/year?year=${year}`,
        method: 'GET'
      });
      if (result.statusCode === 200 && result.data?.analyses) {
        // 将月度分析数据按月份存储
        const analysesMap: {[key: string]: any} = {};
        result.data.analyses.forEach((analysis: any) => {
          const monthKey = `${year}-${analysis.month}`;
          analysesMap[monthKey] = analysis;
        });
        
        setYearAnalyses(analysesMap);
        console.log('年度分析数据已存储:', analysesMap);
      }
    } catch (error) {
      console.error('获取年度分析数据失败:', error);
    }
  }


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
    setShowSlideHint(false); // 隐藏滑动提示
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
        const newPageIndex = pairIndex + 1;
        setPairIndex(newPageIndex);
        // 保存新页面位置到缓存
        savePageToCache(newPageIndex);
        setIsFlipping(false);
        setFlipPercent(0);
        setFlipDirection(null);
      }, 500);
    } else if (flipDirection === 'right' && flipPercent > 0.3 && pairIndex > 0) {
      setIsFlipping(true);
      setFlipPercent(1);
      setTimeout(() => {
        const newPageIndex = pairIndex - 1;
        setPairIndex(newPageIndex);
        // 保存新页面位置到缓存
        savePageToCache(newPageIndex);
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
        <MoodCalendarSummary 
          bookData={bookData?.[pairIndex]} 
          month={pairIndex} 
          year={currentYear}
          monthAnalyses={yearAnalyses?.[`${currentYear}-${pairIndex}`]}
        />
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
          <MoodCalendarSummary 
            bookData={bookData?.[pairIndex]} 
            month={pairIndex+1} 
            year={currentYear}
            monthAnalyses={yearAnalyses?.[`${currentYear}-${pairIndex+1}`]}
          />
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
          <MoodCalendarSummary 
            bookData={bookData?.[pairIndex]} 
            month={pairIndex+1} 
            year={currentYear}
            monthAnalyses={yearAnalyses?.[`${currentYear}-${pairIndex+1}`]}
          />
        </View>
      );
    }
    return null;
  };



  return (
    <View className="book-bg">
      <PageHeader title="心情日记" />
      <View className='book-title'>2025年</View>
      {/* 调试信息：显示当前页面位置
      <View style={{ position: 'absolute', top: '120px', right: '20px', fontSize: '12px', color: '#999', zIndex: 10 }}>
        第{pairIndex + 1}页
        <View 
          onClick={clearCache}
          style={{ 
            marginTop: '5px', 
            padding: '2px 6px', 
            background: '#f0f0f0', 
            borderRadius: '3px',
            fontSize: '10px'
          }}
        >
          清除缓存
        </View>
      </View> */}
      <View
        className="book-outer"
        catchMove={true}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 滑动效果 */}
        <SlideHint 
          show={showSlideHint} 
          position="right"
        />
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