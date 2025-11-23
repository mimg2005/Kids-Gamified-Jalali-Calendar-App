import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { toPersianDigits } from '../lib/jalali';
import { ShoppingBag, CheckCircle2, Star, Zap } from 'lucide-react';
import { calculateLevel, LevelInfo } from '../lib/levels'; // ایمپورت جدید

export const DashboardHome = () => {
  const [user, setUser] = useState<any>(null);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // 1. دریافت اطلاعات کاربر
      const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single();
      setUser(userData);

      // 2. محاسبه سطح بر اساس XP
      if (userData) {
        const info = calculateLevel(userData.xp || 0);
        setLevelInfo(info);
      }

      // 3. دریافت جوایز منتظر تحویل
      const { data: redemptionData } = await supabase
        .from('redemptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_fulfilled', false)
        .order('created_at', { ascending: false });
      
      if (redemptionData) setRedemptions(redemptionData);
    }
  };

  const markAsFulfilled = async (id: string) => {
    if (!confirm('آیا این جایزه را به کودک تحویل دادید؟')) return;
    await supabase.from('redemptions').update({ is_fulfilled: true }).eq('id', id);
    setRedemptions(prev => prev.filter(r => r.id !== id));
  };

  if(!user || !levelInfo) return <div className="p-10 text-center font-bold text-gray-400">درحال بارگذاری... ⏳</div>;

  return (
    <div className="space-y-6 pb-20">
      {/* کارت پروفایل و سطح - طراحی جدید */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 rounded-[2rem] p-6 text-white shadow-2xl overflow-hidden">
        
        {/* پس زمینه تزیینی */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

        <div className="relative z-10 flex items-start gap-4">
          {/* آواتار */}
          <div className="flex-shrink-0">
            <div className="text-6xl bg-white/20 p-3 rounded-full backdrop-blur-md border-4 border-white/30 shadow-lg">
              {user.avatar || '🐻'}
            </div>
            <div className="bg-yellow-400 text-yellow-900 font-black text-center text-xs py-1 rounded-full mt-[-15px] relative z-20 border-2 border-white shadow-sm">
              Level {toPersianDigits(levelInfo.level)}
            </div>
          </div>

          {/* اطلاعات متنی */}
          <div className="flex-1">
            <h1 className="text-3xl font-black mb-1">{user.name}</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1 border border-white/10">
                <Zap size={12} className="text-yellow-300 fill-yellow-300"/>
                {levelInfo.title}
              </span>
            </div>
            
            {/* نوار پیشرفت XP */}
            <div className="relative pt-2">
              <div className="flex justify-between text-[10px] font-bold opacity-80 mb-1 px-1">
                <span>{toPersianDigits(user.xp)} XP</span>
                <span>{toPersianDigits(levelInfo.maxXp)} XP</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-4 relative overflow-hidden border border-white/10">
                <div 
                  className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(234,179,8,0.6)]"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                >
                  {/* افکت درخشش روی نوار */}
                  <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-l from-transparent via-white/30 to-transparent opacity-50 animate-shimmer"></div>
                </div>
              </div>
              <p className="text-[10px] mt-2 opacity-90 font-bold leading-relaxed bg-black/20 p-2 rounded-xl border border-white/5">
                ✨ {levelInfo.message}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* آمار سریع */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border-b-4 border-yellow-200 shadow-sm flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform">
          <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-2xl mb-2 group-hover:rotate-12 transition-transform">
            💰
          </div>
          <h3 className="font-bold text-gray-500 text-xs">سکه قابل خرج</h3>
          <p className="text-3xl font-black text-gray-800 mt-1">{toPersianDigits(user.coins || 0)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border-b-4 border-blue-200 shadow-sm flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl mb-2 group-hover:-rotate-12 transition-transform">
            ⭐
          </div>
          <h3 className="font-bold text-gray-500 text-xs">کل تجربه (XP)</h3>
          <p className="text-3xl font-black text-gray-800 mt-1">{toPersianDigits(user.xp || 0)}</p>
        </div>
      </div>

      {/* بخش جوایز خریداری شده (برای والدین) */}
      {redemptions.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-orange-200 p-5 shadow-lg relative overflow-hidden animate-pulse-slow">
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-400"></div>
          <h3 className="text-lg font-black text-orange-600 mb-4 flex items-center gap-2">
            <ShoppingBag size={20} />
            باید بخریم (والدین):
          </h3>
          
          <div className="space-y-3">
            {redemptions.map(r => (
              <div key={r.id} className="flex items-center justify-between bg-orange-50 p-3 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{r.reward_emoji}</span>
                  <div>
                    <span className="font-bold text-gray-800 block">{r.reward_title}</span>
                    <span className="text-xs text-orange-400 font-bold">هزینه شده: {toPersianDigits(r.cost)} سکه</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => markAsFulfilled(r.id)}
                  className="bg-white text-green-500 p-2 rounded-xl shadow-sm border border-green-100 hover:bg-green-50 transition-colors"
                  title="تحویل داده شد"
                >
                  <CheckCircle2 size={24} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};