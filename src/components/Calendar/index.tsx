import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import React from 'react';
import { MoodListData } from '@/store/moods';

import { getEmojiMap, getSkinType } from '@/utils/emojiMaps';
import { isFuture } from '@/utils/date';

import './index.less'; 


// 日历头部星期
const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];


interface CalendarProps {
  year: number;
  month: number; // 月份（1-12）
  emojiData: MoodListData; // 传入的表情数据，key 为日期
  handleSltMood: (date: { year: number; month: number; date: number }) => void; // 选择日期的回调
}

const Calendar: React.FC<CalendarProps> = ({ year, month, emojiData = {}, handleSltMood }) => {
  // 获取当月天数
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };

  // 获取当月第一天是周几
  const getFirstDayOfWeek = (year: number, month: number): number => {
    return new Date(year, month - 1, 1).getDay();
  };

  const numberOfDays = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);

  // 跳转到日记列表页
  const goToMoodList = (hasRecord, dayNumber) => {
    if (hasRecord) {
      Taro.navigateTo({ url: `/pages/mood-list/index?day=${dayNumber}&month=${month}&year=${year}` });
    }
  };
  
  return (
    <View className='mood-calendar'>
        {weekdays.map((day, index) => (
          <View key={index} className='mood-calendar__weekday'>
            {day}
          </View>
        ))}

        {/* 补齐月初空白 */}
        {[...Array(firstDayOfWeek)].map((_, i) => <View key={`empty-${i}`} className='mood-calendar__day'></View>)}
        {/* 渲染每一天 */}
        {[...Array(numberOfDays)].map((_, index) => {
          const dayNumber = index + 1;
          let emojiSrc: string | null = null;
          
          if (emojiData[dayNumber.toString()]) {
            const emojiName = emojiData[dayNumber.toString()]?.mood
           
            // 动态获取皮肤类型
            const skinType = getSkinType(emojiName);
            const emojiMapBySkin = getEmojiMap(skinType) || {};

            emojiSrc = emojiMapBySkin[emojiName]?.src;
           
          }
          // 超过今天的日期不可点击
          const isFutureDate = isFuture(year, month, dayNumber);
          return (
            <View 
              key={dayNumber} 
              className={`mood-calendar__day${isFutureDate ? ' mood-calendar__day--future' : ''}`} 
              onClick={
                isFutureDate ? undefined : (
                  () => emojiSrc ? goToMoodList(emojiSrc, dayNumber) 
                   : handleSltMood({ year, month, date:dayNumber})
                )
              }
            >
              {dayNumber}
              {emojiSrc && (
                <Image 
                  className='mood-calendar__emoji' 
                  src={emojiSrc} 
                  mode='aspectFit'
                />
              )}
            </View>
          );
        })}
      </View>
  )
}

export default Calendar;