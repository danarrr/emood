import { View, Text, Image } from '@tarojs/components';
import { getSkinType, getEmojiMap } from '@/utils/emojiMaps'
import './index.less';

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

const MoodCalendarSummary = ({ bookData = {}, year, month }: { year: number, month: number, bookData: any }) => {
  const daysInMonth = getDaysInMonth(year, month);

  // 计算每周的天数
  const weeks: number[][] = [];
  let week: number[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7 || day === daysInMonth) {
      weeks.push(week);
      week = [];
    }
  }


  return (
    <View className="mood-calendar-summary-container">
      {/* Month Title */}
      <View className="month-title"><Text>{month}月</Text></View>

      {/* Calendar */}
      <View className="calendar">
        {weeks.map((weekDays, weekIdx) => (
          <View className="week" key={weekIdx}>
            <View className="week-number">{`第${weekIdx + 1}周`}</View>
            <View className="date-grid">
              {weekDays.map(day => {
                const itemMood = bookData[day]?.mood
                const skinType = getSkinType(itemMood);
                return (
                <View key={`day-${day}`} className="date-item">
                  {day}
                  {itemMood && (
                    <Image
                      className="emoji"
                      src={getEmojiMap(skinType)?.[itemMood]?.src}
                      mode="aspectFit"
                    />
                  )}
                </View>
              )}
              )}
              {/* 补齐最后一周的空格 */}
              {weekIdx === weeks.length - 1 && weekDays.length < 7 &&
                Array.from({ length: 7 - weekDays.length }).map((_, i) => (
                  <View key={`empty-${i}`} className="date-item"></View>
                ))
              }
            </View>
          </View>
        ))}
      </View>

      {/* AI Summary */}
      <View className="ai-summary">
        <View className="ai-summary-title">上帝视角(AI总结)</View>
        <View className="ai-summary-content">
          程序员小姐姐正在马不停蹄开发中
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