import { View, Text, Image } from '@tarojs/components';
import React from 'react';
import './index.less'; // Assuming a corresponding less file

// 导入表情图片
import happyEmoji from '../../imgs/emoji/happy.png';
import sadEmoji from '../../imgs/emoji/sad.png';

// Define weekdays for the calendar header
const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// 表情映射表
const emojiMap = {
  'happy': happyEmoji,
  'sad': sadEmoji
};

interface CalendarProps {
  year: number;
  month: number; // Month number (1-12)
  emojiData?: { [key: string]: string }; // 修改类型定义，value 为表情图片名称
  // 1: {
  //   1: 'happy',
  //   5: 'sad', // 没记录则直接不返回。
  //   30: 'sad',
  // },
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
            emojiSrc = emojiMap[emojiData[dayNumber.toString()]?.mood];
          }
          
          return (
            <View key={dayNumber} className='mood-calendar__day'>
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