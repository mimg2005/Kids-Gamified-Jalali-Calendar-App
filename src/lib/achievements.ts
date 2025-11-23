export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredXp: number;
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'beginner',
    title: 'شروع ماجرا',
    description: 'کسب اولین ۵۰ امتیاز تجربه',
    icon: '🎒',
    requiredXp: 50
  },
  {
    id: 'bronze_cup',
    title: 'مدال برنزی',
    description: 'رسیدن به ۲۰۰ امتیاز تجربه',
    icon: '🥉',
    requiredXp: 200
  },
  {
    id: 'silver_cup',
    title: 'مدال نقره‌ای',
    description: 'عبور از ۵۰۰ امتیاز (نگهبان جوان)',
    icon: '🥈',
    requiredXp: 500
  },
  {
    id: 'gold_cup',
    title: 'مدال طلایی',
    description: 'رسیدن به ۱۰۰۰ امتیاز (جنگجوی شجاع)',
    icon: '🥇',
    requiredXp: 1000
  },
  {
    id: 'rich_kid',
    title: 'مایه دار!',
    description: 'جمع‌آوری ۱۵۰۰ امتیاز تجربه',
    icon: '💎',
    requiredXp: 1500
  },
  {
    id: 'smart_hero',
    title: 'نابغه کوچک',
    description: 'رسیدن به ۲۰۰۰ امتیاز (نگهبان دانا)',
    icon: '🧠',
    requiredXp: 2000
  },
  {
    id: 'super_star',
    title: 'سوپر استار',
    description: 'رسیدن به ۳۰۰۰ امتیاز (شوالیه روشنایی)',
    icon: '🌟',
    requiredXp: 3000
  },
  {
    id: 'king',
    title: 'پادشاه کهکشان',
    description: 'رسیدن به ۵۰۰۰ امتیاز (بالاترین سطح)',
    icon: '👑',
    requiredXp: 5000
  },
  {
    id: 'legend',
    title: 'اسطوره بی‌پایان',
    description: 'کسب ۱۰۰۰۰ امتیاز باورنکردنی!',
    icon: '🚀',
    requiredXp: 10000
  }
];