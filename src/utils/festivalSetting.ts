import bgBirthday from '@/imgs/bg-birthday@2x.png';
import bgNight from '@/imgs/bg-night@2x.png';
import bgChristmas from '@/imgs/bg-chirsmax@2x.png';
import bgDefault from '@/imgs/bg@2x.png';




export function getFestivalBgImage(birthdayMonth?: string) {
  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth() + 1;
  const date = now.getDate();

  if (birthdayMonth && month === +birthdayMonth) {
    return bgBirthday;
  }

  if (hour >= 20 || hour < 6) {
    return bgNight;
  }

  if (month === 12) {
    return bgChristmas;
  }
  
 
  return bgDefault;
}

export function getGreetingTxt(birthdayMonth?: string) {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0=周日, 5=周五
  const month = now.getMonth() + 1; // 1-12

  // BIRTHDAY_MONTH

  if (birthdayMonth && month === +birthdayMonth) {
    return { hello: 'Birthday Month', question: '寿星公快乐~' };
  }
  if (hour >= 20) {
    return { hello: '夜深了~', question: '想和我说点啥？' };
  }
  if (day === 5) {
    return { hello: 'Happy Friday!', question: '放假噜~' };
  }
  return { hello: 'Hello~', question: '今天过得怎样？' };
}