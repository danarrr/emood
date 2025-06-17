import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import PageHeader from '../../components/PageHeader';
import './index.less';

// 导入表情图片 (你需要根据实际情况导入这些图片)
import happyEmoji from '../../imgs/emoji/happy.png';
import sadEmoji from '../../imgs/emoji/sad.png';
import bad111Emoji from '../../imgs/emoji/bad111.png';
import bad222Emoji from '../../imgs/emoji/bad222.png';
import bad333Emoji from '../../imgs/emoji/bad333.png';

const emojiMap = {
  'happy': happyEmoji,
  'sad': sadEmoji,
  'bad111': bad111Emoji,
  'bad222': bad222Emoji,
  'bad333': bad333Emoji,
};

interface MoodRecordItem {
  _id: string;
  year: number;
  month: number;
  day: number;
  mood: string; // 对应 emojiMap 的键
  content: string;
  images?: string[]; // 云存储 fileID 数组
  createTime: string;
}

export default function MoodList() {
  const [moodRecords, setMoodRecords] = useState<MoodRecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLoad(() => {
    fetchMoodRecords();
  });

  const goBack = () => {
    Taro.navigateBack();
  };

  const getMoodList = async (year: number, month?: number) => {
    try {
      const result = await Taro.cloud.callContainer({
        path: '/mood/list',
        method: 'GET',
        header: {
          'X-WX-SERVICE': 'emh-platform-server',
        },
        data: {
          year: '2025',
          month: '06',
        },
      });

      if (result.statusCode === 200 && result.data) {
      //   // 假设 result.data 结构是 { year: { month: [record1, record2] } }
      //   // 我们需要扁平化数据以便在列表中显示
        // const allRecords: MoodRecordItem[] = [];
        const allRecords = Object.values(result.data.data[6]) // 这里只是6月份细节的value
      //   for (const monthKey in result.data) {
      //     if (Object.prototype.hasOwnProperty.call(result.data, monthKey)) {
      //       allRecords.push(...result.data[monthKey]);
      //     }
      // //   }
      //   // 按日期降序排序
      //   allRecords.sort((a, b) => {
      //     const dateA = new Date(a.year, a.month - 1, a.day).getTime();
      //     const dateB = new Date(b.year, b.month - 1, b.day).getTime();
      //     return dateB - dateA;
      //   });

        return allRecords;
      // } else {
      //   throw new Error(`获取数据失败: ${result.data?.message || '未知错误'}`);
      }
    } catch (err) {
      console.error('获取心情记录失败:', err);
      throw new Error(`获取数据失败: ${(err as Error).message}`);
    }
  };

  const fetchMoodRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentYear = new Date().getFullYear();
      const allRecords = await getMoodList(currentYear); // 默认获取当前年份所有记录
      console.log('????allRecords', allRecords)
      setMoodRecords(allRecords);
    } catch (err) {
      setError((err as Error).message);
      Taro.showToast({
        title: (err as Error).message,
        icon: 'none',
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // 格式化日期显示（周几，几日）
  const formatDay = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day);
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return `周${weekdays[date.getDay()]} ${day}日`;
  };

  return (
    <View className='mood-list-page'>
      <PageHeader goBack={goBack} title='心情列表' />
      {loading && <Text className='loading-text'>加载中...</Text>}
      {error && <Text className='error-text'>{error}</Text>}
      {!loading && moodRecords.length === 0 && !error && (
        <Text className='no-data-text'>暂无心情记录</Text>
      )}
      <ScrollView
        scrollY
        className='mood-list-scroll'
      >
        {!loading && moodRecords.map((record) => (
          <View className='mood-list-item' key={record._id}>
            <View className='mood-list-item__header'>
              <Text className='mood-list-item__date'>
                {formatDay(record.year, record.month, record.day)}
              </Text>
              <Text className='mood-list-item__more'>...</Text>
            </View>
            <View className='mood-list-item__card'>
              <Image src={emojiMap[record.mood]} className='mood-list-item__emoji' />
              <Text className='mood-list-item__content'>
                {record.content}
              </Text>
              {record.images && record.images.length > 0 && (
                <Image 
                  src={record.images[0]} 
                  className='mood-list-item__image' 
                  mode='aspectFill' 
                />
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
} 