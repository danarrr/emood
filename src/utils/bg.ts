import bgBirthday from '@/imgs/bg-birthday@2x.png';
import bgNight from '@/imgs/bg-night@2x.png';
import bgChristmas from '@/imgs/bg-chirsmax@2x.png';
import bgDefault from '@/imgs/bg@2x.png';


const BIRTHDAY_MONTH = 6; // 你的生日月

export function getBgImage() {
  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth() + 1;
  const date = now.getDate();

  if (hour >= 20 || hour < 6) {
    return bgNight;
  }

  if (month === 12) {
    return bgChristmas;
  }
  
  if (month === BIRTHDAY_MONTH) {
    return bgBirthday;
  }
 
  return bgDefault;
}