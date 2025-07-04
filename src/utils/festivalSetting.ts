import bgBirthday from '@/imgs/bg-birthday@2x.png';
import bgNight from '@/imgs/bg-night@2x.png';
import bgChristmas from '@/imgs/bg-chirsmax@2x.png';
import bgDefault from '@/imgs/bg@2x.png';


const BIRTHDAY_MONTH = 6; // 你的生日月

export function getFestivalBgImage() {
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

export function getGreetingTxt() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0=周日, 5=周五
  const month = now.getMonth() + 1; // 1-12

  // BIRTHDAY_MONTH
  if (month === 5) {
    return { hello: '生日月快乐！', question: '祝你生日月开心每一天！' };
  }
  if (hour >= 20) {
    return { hello: '夜深了~', question: '想和我说点啥？' };
  }
  if (day === 5) {
    return { hello: 'Happy Friday!', question: '放假噜~' };
  }
  return { hello: 'Hello~', question: '今天过得怎样？' };
}