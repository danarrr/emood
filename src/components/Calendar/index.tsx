import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import React from 'react';

import { emoji1Map } from '@imgs/emoji1/emoji1Map'; // 路径按实际调整

import './index.less'; // Assuming a corresponding less file


// Define weekdays for the calendar header
const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];



interface CalendarProps {
  year: number;
  month: number; // Month number (1-12)
  emojiData?: { [key: string]: string }; // 修改类型定义，value 为表情图片名称

}

const Calendar: React.FC<CalendarProps> = ({ year, month, emojiData = {} }) => {

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

  const handleClick = (emojiSrc) => {
    if (emojiSrc) {
      Taro.navigateTo({ url: '/pages/mood-list/index?day=' });
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
            emojiSrc = emoji1Map[emojiName]
          }
          
          return (
            <View key={dayNumber} className='mood-calendar__day' onClick={emojiSrc ? handleClick : undefined}>
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