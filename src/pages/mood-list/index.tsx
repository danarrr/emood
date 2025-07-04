import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useAppDispatch, useAppSelector } from '@/store';
import { getMoodListAction } from '@/store/moods/actions'

import { getEmojiMap, getSkinType } from '@/utils/emojiMaps';

import PageHeader from '@components/PageHeader';

import IconMore from '@imgs/icon-more.png';

import './index.less';
import { cloudRequest } from '@/utils/request';
import { getNowDateInfo } from '@/utils/date';


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
  const dispatch = useAppDispatch()
  const moodlist = useAppSelector((state) => state.mood.moodList);
  const router = useRouter();
  const { year, month } = router.params;

  const [moodRecords, setMoodRecords] = useState<MoodRecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

  const getEmojiConfigMap = (emojiName: string = '') => {
    const skinType = getSkinType(emojiName);
    const emojiMapBySkin = getEmojiMap(skinType) || {};
    return emojiMapBySkin;
  }

  useEffect(() => {
    getMoodList(Number(year), Number(month));
  }, [year, month]);

  const getMoodList = async (year: number, month?: number) => {
    setLoading(true);
    setError(null);
    try {
      const allRecords = Object.values(moodlist.data?.[month] ?? {}) as MoodRecordItem[];
      console.log('111allRecords', allRecords)
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
  const formatDay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr.replace(/-/g, '/')); // 兼容 iOS
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const day = date.getDate();
    return `周${weekdays[date.getDay()]} ${day}日`;
  };

  const reLoadMoodList = async(year, month) => {
    await dispatch(getMoodListAction({ data: { year }}));
    await getMoodList(Number(year), Number(month));
  }

  const handleDelete = async (year: number, month: number, day: number) => {
    try {
      const res = await cloudRequest({
        path: 'mood/delete',
        method: 'POST',
        data: { year, month, day }
      });
      if (res) { Taro.showToast({ title: '删除成功', icon: 'none'});
        reLoadMoodList(year, month) // 刷新列表
      }
    } catch (err) {
      Taro.showToast({ title: '删除失败' });
    }
  }

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

  const handleEdit = (record) => {
    const dateArr = record.dateStr.split('-');

    Taro.showActionSheet({
      itemColor: '#383838',
      itemList: ['编辑', '删除'],
      success: function (res) {
        if (res.tapIndex === 0) {
          
          goTo('mood-detail', {
            mood: record.mood,
            date: JSON.stringify({
              year: dateArr[0],
              month: dateArr[1],
              date: dateArr[2]
            }) // 先序列化对象
          })
        } else if (res.tapIndex === 1) {
          handleDelete(
            dateArr[0],
            dateArr[1],
            dateArr[2]
          )
        } 
      }
    })
  }



  return (
    <View className='mood-list-page'>
      <PageHeader title='心情列表' />
      {loading && <Text className='loading-text'>加载中...</Text>}
      {error && <Text className='error-text'>{error}</Text>}
      {!loading && moodRecords.length === 0 && !error && (
        <Text className='no-data-text'>暂无心情记录</Text>
      )}
      <ScrollView
        scrollY
        className='mood-list-scroll'
      >
        {!loading && moodRecords.map((record) => {
          const { dateStr, mood, content, images } = record
          return (
            <View className='mood-list-item' key={record._id}>
              <View className='mood-list-item__header'>
                <Text className='mood-list-item__date'>
                  {formatDay(dateStr)}
                </Text>
                <Image className='mood-list-item__more' src={IconMore} onClick={() => handleEdit(record)} />
              </View>
              <View className='mood-list-item__card'>
                <Image src={getEmojiConfigMap(mood)?.[mood]?.src} className='mood-list-item__emoji' />
                <Text className='mood-list-item__content'>
                  {content}
                </Text>
                {images && images.length > 0 && (
                  <Image 
                    src={images[0]} 
                    className='mood-list-item__image' 
                    mode='aspectFill' 
                  />
                )}
              </View>
            </View>
          )
        })}
      </ScrollView>
    </View>
  );
} 