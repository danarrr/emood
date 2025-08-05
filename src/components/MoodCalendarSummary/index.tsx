import { View, Text, Image } from '@tarojs/components';
import { useAppSelector } from '@/store';
import { getSkinType, getEmojiMap } from '@/utils/emojiMaps'
import './index.less';

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

const MoodCalendarSummary = ({ bookData = {}, year, month, monthAnalyses = {} }: { year: number, month: number, bookData: any, monthAnalyses?: {[key: string]: any} }) => {
  const userInfo = useAppSelector((state) => state.user.userInfo.data);
  const isMember = userInfo?.isMember;
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

      {/* AI Summary - 仅会员可见 */}
      {isMember && (
        <View className="ai-summary">
          <View className="ai-summary-title">上帝视角</View>
          <View className="ai-summary-content">
            {monthAnalyses?.content || monthAnalyses?.message || '暂无数据'}
          </View>
        </View>
      )}
    </View>
  );
};

export default MoodCalendarSummary; 