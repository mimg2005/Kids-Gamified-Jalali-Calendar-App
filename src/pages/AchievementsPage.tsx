import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ACHIEVEMENTS_LIST } from '../lib/achievements';
import { toPersianDigits } from '../lib/jalali';
import { Lock, CheckCircle2, Trophy } from 'lucide-react';
import clsx from 'clsx';

export const AchievementsPage = () => {
  const [userXp, setUserXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchXp = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('xp')
          .eq('id', user.id)
          .single();
        
        if (data) setUserXp(data.xp || 0);
      }
      setLoading(false);
    };

    fetchXp();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-400 font-bold">درحال بررسی افتخارات... 🏆</div>;

  // محاسبه تعداد باز شده‌ها
  const unlockedCount = ACHIEVEMENTS_LIST.filter(a => userXp >= a.requiredXp).length;
  const totalCount = ACHIEVEMENTS_LIST.length;
  const progressPercent = (unlockedCount / totalCount) * 100;

  return (
    <div className="pb-24">
      {/* هدر */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-b-[3rem] shadow-lg mb-8 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
        <Trophy size={48} className="mx-auto mb-2 drop-shadow-md animate-pulse" />
        <h1 className="text-3xl font-black drop-shadow-md">تالار افتخارات</h1>
        <p className="text-yellow-100 font-bold text-sm mt-1">
          {toPersianDigits(unlockedCount)} از {toPersianDigits(totalCount)} نشان دریافت شده
        </p>

        {/* نوار پیشرفت کلی */}
        <div className="mt-4 bg-black/20 rounded-full h-3 w-2/3 mx-auto backdrop-blur-sm border border-white/20 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* لیست بج‌ها */}
      <div className="px-4 grid grid-cols-2 gap-4">
        {ACHIEVEMENTS_LIST.map((badge) => {
          const isUnlocked = userXp >= badge.requiredXp;
          
          return (
            <div 
              key={badge.id} 
              className={clsx(
                "relative p-4 rounded-3xl border-b-4 flex flex-col items-center text-center transition-all duration-500",
                isUnlocked 
                  ? "bg-white border-yellow-400 shadow-yellow-100 shadow-lg scale-[1.02]" 
                  : "bg-gray-100 border-gray-300 grayscale opacity-80"
              )}
            >
              {/* آیکون وضعیت (قفل یا تیک) */}
              <div className="absolute top-3 right-3">
                {isUnlocked ? (
                  <CheckCircle2 className="text-green-500" size={20} />
                ) : (
                  <Lock className="text-gray-400" size={20} />
                )}
              </div>

              {/* آیکون بج */}
              <div className={clsx(
                "text-5xl mb-3 transition-transform duration-500",
                isUnlocked ? "animate-bounce-in scale-110 drop-shadow-md" : "opacity-50"
              )}>
                {badge.icon}
              </div>

              <h3 className={clsx("font-black text-lg mb-1", isUnlocked ? "text-gray-800" : "text-gray-500")}>
                {badge.title}
              </h3>
              
              <p className="text-[10px] font-bold text-gray-400 leading-tight mb-3 h-8 flex items-center justify-center">
                {badge.description}
              </p>

              {/* نوار وضعیت تکی */}
              <div className={clsx(
                "w-full py-1 rounded-lg font-black text-xs flex items-center justify-center gap-1",
                isUnlocked ? "bg-yellow-100 text-yellow-700" : "bg-gray-200 text-gray-500"
              )}>
                {isUnlocked ? (
                  <span>دریافت شد! 🎉</span>
                ) : (
                  <span>
                    {toPersianDigits(badge.requiredXp)} <span className="text-[9px]">XP نیاز است</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};