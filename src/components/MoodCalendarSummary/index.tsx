import React from 'react';
import { View, Text } from '@tarojs/components';
import './index.less';

const MoodCalendarSummary = ({ month }: { month: number }) => {
  return (
    <View className="mood-calendar-summary-container">
      {/* Month Title */}
      <View className="month-title">{month}月</View>

      {/* Calendar */}
      <View className="calendar">
        {/* Weekday headers are not in the image, but week numbers are */}
        {/* Week 1 */}
        <View className="week">
          <View className="week-number">第一周</View>
          <View className="date-grid">
            {/* Empty cells for days before 1st (assuming 1st is Thursday) */}
            {[...Array(3)].map((_, i) => <View key={`empty1-${i}`} className="date-item"></View>)}
            {[1, 2, 3, 4, 5, 6, 7].map(day => (
              <View key={`day1-${day}`} className="date-item">
                {day}
                {[4, 5, 6, 7].includes(day) && <Text className="emoji">😐</Text>}
              </View>
            ))}
          </View>
        </View>
        {/* Week 2 */}
        <View className="week">
           <View className="week-number">第二周</View>
           <View className="date-grid">
              {[8, 9, 10, 11, 12, 13, 14].map(day => (
                <View key={`day2-${day}`} className="date-item">
                  {day}
                  {[8, 9, 12, 14].includes(day) && <Text className="emoji">😐</Text>}
                </View>
              ))}
           </View>
        </View>
        {/* Week 3 */}
        <View className="week">
           <View className="week-number">第三周</View>
           <View className="date-grid">
              {[15, 16, 17, 18, 19, 20, 21].map(day => (
                <View key={`day3-${day}`} className="date-item">
                  {day}
                </View>
              ))}
           </View>
        </View>
        {/* Week 4 */}
        <View className="week">
           <View className="week-number">第四周</View>
           <View className="date-grid">
              {[22, 23, 24, 25, 26, 27, 28].map(day => (
                <View key={`day4-${day}`} className="date-item">
                  {day}
                  {[25, 27].includes(day) && <Text className="emoji">😐</Text>}
                </View>
              ))}
           </View>
        </View>
         {/* Week 5 */}
         <View className="week">
            <View className="week-number">第五周</View>
            <View className="date-grid">
              {[29, 30, 31].map(day => (
                <View key={`day5-${day}`} className="date-item">
                   {day}
                   {day === 31 && <Text className="emoji">😐</Text>}
                </View>
              ))}
              {/* Empty cells after 31st */}
              {[...Array(7 - (31 - 28))].map((_, i) => <View key={`empty5-${i}`} className="date-item"></View>)} {/* Adjust number of empty cells */}
            </View>
         </View>
      </View>

      {/* AI Summary */}
      <View className="ai-summary">
        <View className="ai-summary-title">AI总结</View>
        <View className="ai-summary-content">
          <View className="summary-item">五月关键词: 成长、热爱、小确幸。</View>
          <View className="summary-item"><Text className="icon">✅</Text>完成 [<Text>具体目标, 如 "21天晨跑"</Text>], 收获 [<Text>"自律即自由"</Text>];</View>
          <View className="summary-item"><Text className="icon">✨</Text>高光时刻: [<Text>"事件, 如 "陪父母看夕阳" "项目结案聚餐"</Text>];</View>
          <View className="summary-item"><Text className="icon">⚠️</Text>待改进: [<Text>“不足, 如 “拖延习惯”</Text>];</View>
          <View className="summary-item"><Text className="icon">✨</Text>六月期许: 心怀[<Text>“关键词, 如 “热忱” “松弛感”</Text>], 奔赴新程。</View>
        </View>
      </View>
    </View>
  );
};

export default MoodCalendarSummary; 