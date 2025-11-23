import jalaali from 'jalaali-js';

export const daysOfWeek = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
export const monthNames = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

// --- تابع جدید برای تبدیل اعداد انگلیسی به فارسی ---
export const toPersianDigits = (n: number | string | undefined | null): string => {
  if (n === undefined || n === null) return '';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
};

export const getJalaliNow = (): JalaliDate => {
  const now = new Date();
  return jalaali.toJalaali(now);
};

export const getDaysInMonth = (jy: number, jm: number) => {
  return jalaali.jalaaliMonthLength(jy, jm);
};

export const getFirstDayOfWeek = (jy: number, jm: number) => {
  const gDate = jalaali.toGregorian(jy, jm, 1);
  const date = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
  const standardDay = date.getDay();
  return (standardDay + 1) % 7;
};

export const toGregorianString = (jy: number, jm: number, jd: number) => {
  const g = jalaali.toGregorian(jy, jm, jd);
  return `${g.gy}-${String(g.gm).padStart(2, '0')}-${String(g.gd).padStart(2, '0')}`;
};


export const formatJalaliDate = (dateStr: string) => {
    const [gYear, gMonth, gDay] = dateStr.split('-').map(Number);
    const j = jalaali.toJalaali(gYear, gMonth, gDay);
    return `${toPersianDigits(j.jd)} ${monthNames[j.jm - 1]} ${toPersianDigits(j.jy)}`;
}