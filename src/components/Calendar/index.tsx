import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import React from 'react';
import { MoodListData } from '@/store/moods';

import { getEmojiMap } from '@/utils/constants';

import './index.less'; // Assuming a corresponding less file


// Define weekdays for the calendar header
const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];


interface CalendarProps {
  year: number;
  month: number; // Month number (1-12)
  emojiData: MoodListData; // 修改类型定义，value 为表情图片名称
  handleSltMood?: void
}

const Calendar: React.FC<CalendarProps> = ({ year, month, emojiData = {}, handleSltMood }) => {
  const emojiMap = getEmojiMap('emoji1')
  // Helper to get number of days in a month
  const getDaysInMonth = (year: number, month: number): number => {
    // Month is 1-based for Date constructor when getting last day
    return new Date(year, month, 0).getDate();
  };

  // Helper to get the weekday of the first day of the month (0 for Sunday)
  const getFirstDayOfWeek = (year: number, month: number): number => {
    // Month is 0-based for Date constructor
    return new Date(year, month - 1, 1).getDay();
  };

  // Calculate number of days and first day of week for the given month and year
  const numberOfDays = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);

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

        {[...Array(firstDayOfWeek)].map((_, i) => <View key={`empty-${i}`} className='mood-calendar__day'></View>)} {/* Empty cells before the 1st */}
        {[...Array(numberOfDays)].map((_, index) => {
          const dayNumber = index + 1;
          let emojiSrc: string | null = null;
          
          if (emojiData[dayNumber.toString()]) {
            const emojiName = emojiData[dayNumber.toString()]?.mood
            emojiSrc = emojiMap[emojiName]?.src
          }
          
          return (
            <View key={dayNumber} className='mood-calendar__day' onClick={emojiSrc ? () => goToMoodList(emojiSrc, dayNumber) : () => {handleSltMood({
              year, month, date:dayNumber
            })}}>
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