import { useState, useRef, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { useAppSelector } from '@/store'
import { MoodListMonthData } from '@/store/moods';


import MoodCalendarSummary from '@components/MoodCalendarSummary';
import PageHeader from '@components/PageHeader';
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
  const touchStartX = useRef(0);

  const moodlist = useAppSelector((state) => state.mood.moodList);
  const auth = 'Bearer pat_0GsD8tD8u4JEf8uFj4klE7SrCfRfvMS1t95MnudjxIpVWuxvImvahyOZqobCJL7C'

  useEffect(() => {
    // getAnalyse()
    getMoodAnalyse()
  },[])
  // const getAnalyse = async() => {
    
  //   // async function callCozeChat() {
  //     // try {
  //     //   const result =  await Taro.request({
  //     //     url: 'https://api.coze.cn/v3/chat?', // 注意去掉问号
  //     //     method: 'POST',
  //     //     header: {
  //     //       'Authorization': auth,
  //     //       'Content-Type': 'application/json'
  //     //     },
  //     //     data: {
  //     //       bot_id: '7530098047934955574',
  //     //       user_id: '123456789',
  //     //       stream: false,
  //     //       additional_messages: [
  //     //         {
  //     //           content: '这两天处理了好多内容，又是创业又是要盯装修，身心俱疲的感觉（使用的你的workflow来回答我的问题，不需要自己再次思考直接返回workflow的内容给我即可）',
  //     //           content_type: 'text',
  //     //           role: 'user',
  //     //           type: 'question'
  //     //         }
  //     //       ],
  //     //       parameters: {}
  //     //     }
  //     //   });
  //     //   if(result) {
  //     //     getAnalyseStatus(result)
  //     //   }
  //     //   // console.log('coze chat result:', res);
  //     //   // 你可以 setState 或处理返回内容
  //     // } catch (err) {
  //     //   console.error('coze chat error:', err);
  //     // }
  // }

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

  // const getAnalyseStatus = async(result) => {
  //   const {data} = result
  //   try {
  //     const res = await Taro.request({
  //       url: `https://api.coze.cn/v3/chat/retrieve?conversation_id=${data.data.conversation_id}&chat_id=${data.data.id}`,
  //       method: 'GET',
  //       header: {
  //         'Authorization': auth,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (res?.data?.data?.status === 'in_progress') {
  //       // 1秒后再次请求
  //       setTimeout(() => {
  //         getAnalyseStatus(result);
  //       }, 1000);
  //     console.log('coze retrieve result1:', res);
  //     // 你可以 setState 或处理返回内容
  //     } else if(res?.data?.data?.status === 'completed'){
  //       getAnalyseResult(data.data.conversation_id, data.data.id)
  //     }else {
  //       console.log('有其他的响应了', res)
  //       // return res.data;
  //     }
  //   } catch (err) {
  //     console.error('coze retrieve error1:', err);
  //     return null;
  //   }
  // }

  // const getAnalyseResult = async(conversation_id, chat_id) => {
  //   try {
  //     const res = await Taro.request({
  //       url: `https://api.coze.cn/v3/chat/message/list?conversation_id=${conversation_id}&chat_id=${chat_id}`,
  //       method: 'GET',
  //       header: {
  //         'Authorization': auth,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     console.log('结果123', res)
  //   } catch (err) {
  //     console.error('coze retrieve error1:', err);
  //     return null;
  //   }
  // }

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
      <View
        className="book-outer"
        catchMove={false}
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