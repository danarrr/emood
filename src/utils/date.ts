// 获取当前年月日的工具函数
export interface MonthInfo {
  month: string;
  year: string;
  date: string;
}

export function getNowDateInfo(): MonthInfo {
  const now = new Date();
  return {
    month: (now.getMonth() + 1).toString(),
    year: now.getFullYear().toString(),
    date: now.getDate().toString(),
  };
}

export function getDateInfo(dataString: string): MonthInfo {
  const curr = new Date(dataString);
  return {
    month: (curr.getMonth() + 1).toString(),
    year: curr.getFullYear().toString(),
    date: curr.getDate().toString(),
  };
}


export const isFuture = (year, month, day) => {
  const today = new Date();
  const isFuture =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth() + 1) ||
    (year === today.getFullYear() && month === today.getMonth() + 1 && day > today.getDate());
  return isFuture;
}