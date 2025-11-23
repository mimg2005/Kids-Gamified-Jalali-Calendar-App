// src/lib/levels.ts

export interface LevelInfo {
  level: number;
  title: string;
  message: string;
  minXp: number;
  maxXp: number;
  progressPercent: number;
  nextLevelXp: number;
}

const LEVEL_CONFIG = [
  { level: 1, max: 500, title: "کاوشگر تازه‌کار", msg: "قدم اول برای تبدیل شدن به یه قهرمان رو برداشتی!" },
  { level: 2, max: 1000, title: "نگهبان جوان", msg: "هنر انجام دادن و کمک کردن رو یاد گرفتی!" },
  { level: 3, max: 1500, title: "جنگجوی شجاع", msg: "با تلاش روزانه و قدرت عالی، شجاعتت رو ثابت کردی!" },
  { level: 4, max: 2500, title: "نگهبان دانا", msg: "دانش، صبر و احترام... تو واقعا خاص شدی!" },
  { level: 5, max: 5000, title: "شوالیه روشنایی", msg: "کمک به خانواده و رفتار عالی، تو رو تبدیل به الگو کرده!" },
  { level: 6, max: 10000, title: "قهرمان کهکشانی", msg: "تو دیگه فقط تلاش نمیکنی، تو الهام بخش هستی!" },
];

export const calculateLevel = (currentXp: number): LevelInfo => {
  let currentLevel = LEVEL_CONFIG[0];
  let minXp = 0;

  // پیدا کردن سطح فعلی
  for (let i = 0; i < LEVEL_CONFIG.length; i++) {
    const lvl = LEVEL_CONFIG[i];
    
    if (currentXp <= lvl.max) {
      currentLevel = lvl;
      break;
    }
    
    // آماده‌سازی برای دور بعدی حلقه
    minXp = lvl.max; // تغییر کوچک: مینیمم لول بعدی دقیقاً ماکسیمم لول قبلی است
    
    // اگر به آخرین مرحله رسید و رد کرد، روی آخرین مرحله قفل کن
    if (i === LEVEL_CONFIG.length - 1) {
        currentLevel = lvl;
    }
  }

  // محاسبه درصد پیشرفت
  const range = currentLevel.max - minXp;
  const earnedInLevel = currentXp - minXp;
  
  let progress = 0;
  if (range > 0) {
      progress = (earnedInLevel / range) * 100;
  }
  
  // جلوگیری از اعداد منفی یا بالای 100
  progress = Math.max(0, Math.min(100, progress));
  
  // اگر آخرین لول را رد کرده باشد (مثلا XP 6000)
  if (currentXp > 5000) progress = 100;

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    message: currentLevel.msg, // <--- اصلاح شده: اینجا msg درست است
    minXp: minXp,
    maxXp: currentLevel.max,
    progressPercent: progress,
    nextLevelXp: Math.max(0, currentLevel.max - currentXp)
  };
};