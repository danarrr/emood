import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useAppDispatch, useAppSelector } from '@/store';
import { DataStatus } from '@/store/interface';
import { getMoodDetailListAction, getMoodListAction } from '@/store/moods/actions'
import { cloudRequest } from '@/utils/request';
import { getEmojiMap, getSkinType } from '@/utils/emojiMaps';

import PageHeader from '@components/PageHeader';

import IconMore from '@imgs/icon-more.png';

// import { getNowDateInfo } from '@/utils/date';

import './index.less';

type MoodImage = {
  imageUrl: string
}

interface MoodRecordItem {
  id: string;
  year: number;
  month: number;
  day: number;
  mood: string; // 对应 emojiMap 的键
  content: string;
  images?: MoodImage[]; // 云存储 fileID 数组
  createTime: string;
}

export default function MoodList() {
  const dispatch = useAppDispatch()
  const moodDetailList = useAppSelector((state) => state.mood.moodDetailList);
  const router = useRouter();
  const { year, month, day } = router.params;

  const [moodRecords, setMoodRecords] = useState<MoodRecordItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [scrollTargetId, setScrollTargetId] = useState<string | undefined>(undefined);

  

  const getEmojiConfigMap = (emojiName: string = '') => {
    const skinType = getSkinType(emojiName);
    const emojiMapBySkin = getEmojiMap(skinType) || {};
    return emojiMapBySkin;
  }

  // 仅首次生效
  useEffect(() => {
    if (moodRecords.length === 0 && moodDetailList.status === DataStatus.INITIAL) {
      getMoodList(year, month);
    }
  }, [year, month]);

  const getMoodList = async (year: number, month?: number) => {
    dispatch(getMoodDetailListAction({ data: {year, month} }))
  };

  useEffect(() => {
    const allRecords = Object.values(moodDetailList.data?.[`${month}`] ?? {}) as unknown as MoodRecordItem[]
    setMoodRecords(allRecords);
  }, [moodDetailList.data, month]);

  useEffect(() => {

    if (day && moodRecords.length > 0) {
      const monthStr = String(month).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const yearStr = String(year);
      const target = moodRecords.find(
        (item) =>
          item.dateStr === `${yearStr}-${monthStr}-${dayStr}`
      );
      
      if (target) {
        setTimeout(() => {
          setScrollTargetId(`mood-item-${target.dateStr}`);
        }, 100);
      }
    }
  }, [day, month, year, moodRecords]);

  // 格式化日期显示（周几，几日）
  const formatDay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr.replace(/-/g, '/')); // 兼容 iOS
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const day = date.getDate();
    return `周${weekdays[date.getDay()]} ${day}日`;
  };

  const reLoadMoodList = async(year, month, index) => {
    await dispatch(getMoodListAction({ data: { year }}));
    moodRecords.splice(index, 1);
    setMoodRecords([...moodRecords]);
  }

  const handleDelete = async (year: number, month: number, day: number, index: number, record: MoodRecordItem) => {
    try {
      const res = await cloudRequest({
        path: `mood/delete?id=${record.id}`,
        method: 'DELETE'
      });
      if (res) { Taro.showToast({ title: '删除成功', icon: 'none'});
        reLoadMoodList(year, month, index) // 刷新列表
      }
    } catch (err) {
      Taro.showToast({ title: '删除失败' });
    }
  }

  const goTo = (route: string, id?: string) => {
    const url = id 
      ? `/pages/${route}/index?id=${id}`
      : `/pages/${route}/index`;
      
    Taro.navigateTo({ url });
  }

  const handleEdit = (record, index) => {
    const dateArr = record.dateStr.split('-');

    Taro.showActionSheet({
      itemColor: '#383838',
      itemList: ['编辑', '删除'],
      success: function (res) {
        if (res.tapIndex === 0) {
          goTo('mood-detail', record.id)
        } else if (res.tapIndex === 1) {
          handleDelete(
            dateArr[0],
            dateArr[1],
            dateArr[2],
            index,
            record
          )
        } 
      }
    })
  }

  return (
    <View className='mood-list-page'>
      <PageHeader title='心情列表' />
      {moodDetailList.status === DataStatus.PENDING && <Text className='loading-text'>加载中...</Text>}
      {moodDetailList.status !== DataStatus.PENDING && moodRecords.length === 0 && !error && (
        <Text className='no-data-text'>暂无心情记录</Text>
      )}
      <ScrollView
        scrollY
        className='mood-list-scroll'
        scrollIntoView={scrollTargetId}
      >
        { moodRecords.map((record, key) => {
          const { id, dateStr, mood, content, images } = record
          return (
            <View
              className='mood-list-item'
              key={id}
              id={`mood-item-${dateStr}`}
            >
              <View className='mood-list-item__header'>
                <Text className='mood-list-item__date'>
                  {formatDay(dateStr)}
                </Text>
                <Image className='mood-list-item__more' src={IconMore} onClick={() => handleEdit(record, key)} />
              </View>
              <View className='mood-list-item__card'>
                <Image src={getEmojiConfigMap(mood)?.[mood]?.src} className='mood-list-item__emoji' />
                <Text className='mood-list-item__content'>
                  {content}
                </Text>
                <View className='mood-list-item_image-box'>
                  {images && images.length > 0 && images.map((item, key) => {
                    return <Image 
                      key={key}
                      src={item.imageUrl} 
                      className='mood-list-item__image' 
                      mode='heightFix' 
                    />
                  })}
                </View>
                
              </View>
            </View>
          )
        })}
      </ScrollView>
    </View>
  );
} 