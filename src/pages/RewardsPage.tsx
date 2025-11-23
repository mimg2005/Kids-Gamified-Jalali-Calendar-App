import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AddRewardModal } from '../components/AddRewardModal';
import { toPersianDigits } from '../lib/jalali';
import { ArrowRight, Lock, Unlock, ShoppingBag, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface Reward {
  id: string;
  title: string;
  cost: number;
  emoji: string;
}

export const RewardsPage = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [coins, setCoins] = useState(0); // سکه قابل خرج
  const [showAddModal, setShowAddModal] = useState(false);
  
  // استیت‌های خرید
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isBuying, setIsBuying] = useState(false);

    const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. دریافت سکه کاربر
    const { data: userData } = await supabase
      .from('users')
      .select('coins')
      .eq('id', user.id)
      .single();
    
    if (userData) setCoins(userData.coins || 0);

    // 2. دریافت لیست جوایز (تغییر یافته به RPC)
    // این تابع چک میکند اگر لیستی نبود، پیش‌فرض‌ها را کپی می‌کند
    const { data: rewardData, error } = await supabase.rpc('get_or_create_rewards', {
      target_user_id: user.id
    });

    if (error) console.error("Error fetching rewards:", error);
    
    // چون دیتابیس آرایه برمی‌گرداند، کست می‌کنیم
    if (rewardData) setRewards(rewardData as Reward[]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBuyClick = (reward: Reward) => {
    if (coins >= reward.cost) {
      setSelectedReward(reward); // باز کردن مودال تایید
    }
  };

  const confirmPurchase = async () => {
    if (!selectedReward) return;
    setIsBuying(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // 1. کسر سکه از کاربر
      const newCoins = coins - selectedReward.cost;
      const { error: coinError } = await supabase
        .from('users')
        .update({ coins: newCoins })
        .eq('id', user.id);

      if (!coinError) {
        // 2. ثبت در جدول خریدها
        await supabase.from('redemptions').insert({
          user_id: user.id,
          reward_title: selectedReward.title,
          reward_emoji: selectedReward.emoji,
          cost: selectedReward.cost
        });
        
        setCoins(newCoins); // آپدیت ظاهر برنامه
        setSelectedReward(null); // بستن مودال
        alert(`هوررررا! 🎉 شما ${selectedReward.title} رو خریدید!`);
      }
    }
    setIsBuying(false);
  };

  return (
    <div className="pb-32 relative">
      
      {/* هدر */}
      <div className="relative flex items-center justify-center mb-6 min-h-[50px]">
        <Link 
          to="/dashboard" 
          className="absolute right-0 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-blue-600 active:scale-95 transition-all"
        >
          <ArrowRight size={24} />
        </Link>
        <h1 className="text-2xl font-black text-purple-700 flex items-center gap-2">
          فروشگاه جوایز <ShoppingBag className="mb-1" />
        </h1>
      </div>

      {/* کیف پول */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 mb-8 flex items-center justify-between border-4 border-white/20">
        <div>
          <p className="text-sm font-bold opacity-80 mb-1">سکه قابل خرج:</p>
          <p className="text-4xl font-black drop-shadow-md flex items-center gap-2">
            {toPersianDigits(coins)} <span className="text-xl opacity-80">سکه</span>
          </p>
        </div>
        <div className="text-5xl opacity-20 rotate-12">💰</div>
      </div>

      {/* لیست جوایز */}
      <div className="space-y-3">
        {rewards.map(reward => {
          const canBuy = coins >= reward.cost;
          return (
            <div 
              key={reward.id} 
              onClick={() => canBuy && handleBuyClick(reward)}
              className={clsx(
                "group flex items-center justify-between p-3 rounded-2xl border-2 transition-all duration-300 cursor-pointer select-none",
                canBuy 
                  ? "bg-white border-green-100 shadow-sm hover:border-green-400 hover:scale-[1.02] active:scale-95" 
                  : "bg-gray-50 border-gray-100 opacity-60 grayscale"
              )}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl shadow-inner border border-gray-100">
                  {reward.emoji}
                </div>
                <h3 className="font-bold text-lg text-gray-800 leading-tight">
                  {reward.title}
                </h3>
              </div>
              
              <div className={clsx(
                "flex flex-col items-center justify-center min-w-[80px] py-2 px-3 rounded-xl ml-2 transition-colors",
                canBuy 
                  ? "bg-green-50 text-green-600 group-hover:bg-green-500 group-hover:text-white" 
                  : "bg-gray-200 text-gray-500"
              )}>
                <span className="text-xs mb-1">
                  {canBuy ? <Unlock size={16} /> : <Lock size={16} />}
                </span>
                <span className="font-black text-lg leading-none">
                  {toPersianDigits(reward.cost)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* دکمه افزودن */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 left-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-xl shadow-purple-300 shadow-xl active:scale-95 transition-transform z-30 border-t border-white/20"
      >
        + تعریف جایزه جدید
      </button>

      {/* مودال افزودن جایزه */}
      {showAddModal && (
        <AddRewardModal onClose={() => setShowAddModal(false)} onAdded={fetchData} />
      )}

      {/* مودال تایید خرید (جدید) */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border-4 border-purple-200 animate-bounce-in">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedReward.emoji}</div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">مطمئنی میخوای بخری؟</h2>
              <p className="text-gray-500 font-bold">
                جایزه <span className="text-purple-600 mx-1">{selectedReward.title}</span> به قیمت 
                <span className="bg-yellow-100 text-yellow-700 px-2 rounded mx-1">{toPersianDigits(selectedReward.cost)}</span> 
                سکه؟
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedReward(null)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200"
              >
                نه، پشیمون شدم
              </button>
              <button 
                onClick={confirmPurchase}
                disabled={isBuying}
                className="flex-1 py-3 rounded-xl bg-green-500 text-white font-bold shadow-green-200 shadow-lg active:scale-95 transition-transform"
              >
                {isBuying ? '...' : 'آره، بخرش! 🛍️'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};