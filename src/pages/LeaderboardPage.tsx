import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { toPersianDigits } from '../lib/jalali';
import { Medal, Trophy, User, Shield } from 'lucide-react';
import clsx from 'clsx';

interface Player {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  isMe?: boolean;
}

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [currentUser, setCurrentUser] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  // لیست پایه ۱۰ نفر اول (امتیازها طبق درخواست شما)
  // ما امتیازهای پایه را می‌گذاریم، بعداً بر اساس روزهای گذشته به این‌ها اضافه می‌شود
  const baseBots = [
    { name: 'آراد', baseXp: 3756, avatar: '🦁' },
    { name: 'سارینا', baseXp: 3620, avatar: '🦄' },
    { name: 'کیان', baseXp: 3510, avatar: '🐯' },
    { name: 'النا', baseXp: 3405, avatar: '🐰' },
    { name: 'بردیا', baseXp: 3300, avatar: '🐲' },
    { name: 'نیکا', baseXp: 3180, avatar: '🐼' },
    { name: 'رادین', baseXp: 3090, avatar: '🐻' },
    { name: 'آوا', baseXp: 2995, avatar: '🦊' },
    { name: 'مهراد', baseXp: 2910, avatar: '🐨' },
    { name: 'تارا', baseXp: 2834, avatar: '🐱' },
  ];

  useEffect(() => {
    calculateLeaderboard();
  }, []);

  const calculateLeaderboard = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. گرفتن اطلاعات واقعی کاربر
    const { data: userData } = await supabase
      .from('users')
      .select('name, xp, avatar, created_at')
      .eq('id', user.id)
      .single();

    if (userData) {
      const myXp = userData.xp || 0;
      const joinDate = new Date(userData.created_at);
      const today = new Date();
      
      // محاسبه تعداد روزهایی که از ثبت نام گذشته
      const diffTime = Math.abs(today.getTime() - joinDate.getTime());
      const daysPassed = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      // 2. آپدیت امتیاز ربات‌ها بر اساس روزهای گذشته
      // به طور میانگین روزی 35 امتیاز (بین 20 تا 50) به آنها اضافه می‌شود
      const dailyGrowth = 35; 
      const growthXp = daysPassed * dailyGrowth;

      let allPlayers: Player[] = baseBots.map((bot) => ({
        rank: 0, // بعدا محاسبه میشه
        name: bot.name,
        xp: bot.baseXp + growthXp, // امتیاز پایه + رشد روزانه
        avatar: bot.avatar,
        isMe: false
      }));

      // 3. اضافه کردن کاربر خودمان به لیست برای مقایسه
      const mePlayer: Player = {
        rank: 0,
        name: userData.name || 'من',
        xp: myXp,
        avatar: userData.avatar || '👤',
        isMe: true
      };

      // 4. ادغام و مرتب‌سازی
      allPlayers.push(mePlayer);
      allPlayers.sort((a, b) => b.xp - a.xp); // از زیاد به کم

      // 5. رتبه‌دهی واقعی
      allPlayers = allPlayers.map((p, index) => ({ ...p, rank: index + 1 }));

      // 6. پیدا کردن جایگاه واقعی کاربر
      const myRealRankIndex = allPlayers.findIndex(p => p.isMe);
      const myRealRank = myRealRankIndex + 1;

      // 7. منطق نمایش (آیا کاربر در ۱۰ نفر اول است؟)
      if (myRealRank <= 10) {
        // اگر جزو ۱۰ نفر اول شدیم، ۱۰ نفر اول واقعی را نشان بده
        setLeaderboard(allPlayers.slice(0, 10));
        setCurrentUser(null); // نیازی به نمایش جداگانه پایین صفحه نیست
      } else {
        // اگر هنوز نرسیدیم:
        // ۱۰ نفر اول (بدون ما) را نشان بده
        setLeaderboard(allPlayers.filter(p => !p.isMe).slice(0, 10));
        
        // محاسبه رتبه فیک (بین 635 تا 11)
        // فرمول: هرچی XP ما به نفر دهم نزدیکتر بشه، رتبه ما از 635 کمتر میشه
        const tenthPlaceXp = allPlayers[9].xp; // امتیاز نفر دهم
        const startRank = 635;
        const targetRank = 11;
        
        // درصد پیشرفت ما نسبت به نفر دهم
        // اگر امتیاز ما 0 باشه، درصد 0 است. اگر اندازه نفر دهم باشه، درصد 100 است
        let progressRatio = myXp / tenthPlaceXp;
        if(progressRatio > 1) progressRatio = 1; // نباید بیشتر از 1 بشه

        // محاسبه رتبه بر اساس پیشرفت
        // فرمول: 635 - (پیشرفت * فاصله رتبه‌ها)
        const simulatedRank = Math.floor(startRank - (progressRatio * (startRank - targetRank)));
        
        setCurrentUser({ ...mePlayer, rank: simulatedRank });
      }
    }
    setLoading(false);
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">درحال محاسبه رتبه‌ها... 📊</div>;

  return (
    <div className="pb-24 relative min-h-screen">
      {/* هدر گرافیکی */}
      <div className="bg-indigo-600 p-6 rounded-b-[3rem] shadow-xl mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <Trophy className="text-yellow-400 mx-auto mb-2 drop-shadow-lg animate-bounce" size={48} />
        <h1 className="text-2xl font-black text-white drop-shadow-md">برترین قهرمانان 🌍</h1>
        <p className="text-indigo-200 text-sm font-bold mt-1">آیا می‌تونی به جمع ۱۰ نفر اول برسی؟</p>
      </div>

      {/* لیست ۱۰ نفر برتر */}
      <div className="px-4 space-y-3">
        {leaderboard.map((player, index) => (
          <div 
            key={index} 
            className={clsx(
              "flex items-center p-3 rounded-2xl border-b-4 transition-all transform",
              player.isMe 
                ? "bg-yellow-100 border-yellow-400 scale-105 shadow-lg z-10" // استایل خاص اگر خودمان در ۱۰ تا بودیم
                : "bg-white border-gray-100 hover:scale-[1.02]"
            )}
          >
             {/* رتبه */}
             <div className="w-8 flex justify-center">
                {player.rank === 1 && <Medal size={28} className="text-yellow-500 drop-shadow-sm" />}
                {player.rank === 2 && <Medal size={28} className="text-gray-400 drop-shadow-sm" />}
                {player.rank === 3 && <Medal size={28} className="text-orange-400 drop-shadow-sm" />}
                {player.rank > 3 && <span className="text-lg font-black text-gray-400">{toPersianDigits(player.rank)}</span>}
             </div>

             {/* آواتار */}
             <div className="text-3xl mx-3 bg-gray-50 rounded-full w-12 h-12 flex items-center justify-center border-2 border-white shadow-sm">
               {player.avatar}
             </div>

             {/* نام */}
             <div className="flex-1">
               <div className="font-bold text-gray-800 text-lg flex items-center gap-1">
                 {player.name}
                 {player.isMe && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">(تو)</span>}
               </div>
             </div>

             {/* امتیاز */}
             <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-xl font-black text-sm border border-indigo-100">
               {toPersianDigits(player.xp)} XP
             </div>
          </div>
        ))}
      </div>

      {/* جداکننده اگر کاربر پایین لیست است */}
      {currentUser && (
        <div className="text-center text-gray-400 text-2xl font-black my-2 tracking-widest">
          . . .
        </div>
      )}

      {/* کارت شناور کاربر فعلی (اگر جزو ۱۰ تا نیست) */}
      {currentUser && (
        <div className="sticky bottom-20 mx-4 mt-2 animate-slide-up">
          <div className="flex items-center p-4 rounded-2xl border-b-4 bg-blue-600 border-blue-800 text-white shadow-2xl relative overflow-hidden">
            {/* افکت درخشش پس‌زمینه */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="w-8 flex justify-center font-black text-xl opacity-80">
                #{toPersianDigits(currentUser.rank)}
            </div>

            <div className="text-3xl mx-3 bg-white/20 rounded-full w-12 h-12 flex items-center justify-center border-2 border-white/30 backdrop-blur-sm">
              {currentUser.avatar}
            </div>

            <div className="flex-1">
              <div className="font-black text-lg">جایگاه فعلی تو</div>
              <div className="text-xs opacity-80 font-bold">ادامه بده! داری میرسی... 🚀</div>
            </div>

            <div className="bg-white text-blue-700 px-3 py-2 rounded-xl font-black text-sm shadow-lg">
              {toPersianDigits(currentUser.xp)} XP
            </div>
          </div>
        </div>
      )}
    </div>
  );
};