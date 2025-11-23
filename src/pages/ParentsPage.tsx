import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { AddTaskModal } from '../components/AddTaskModal';
import { ShieldCheck, LogOut, Lock, Plus } from 'lucide-react';

export const ParentsPage = () => {
  // وضعیت قفل بودن صفحه (پیش‌فرض قفل است)
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  // تاریخ پیش‌فرض برای افزودن تسک (امروز)
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  // بررسی پین‌کد ورود به بخش والدین
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // پین‌کد ساده (در نسخه واقعی می‌توان از دیتابیس گرفت)
    if (pin === '1234') {
      setIsUnlocked(true);
      setPin('');
    } else {
      alert('رمز اشتباه است!');
      setPin('');
    }
  };

  // خروج کامل از حساب کاربری (Logout)
  const handleFullLogout = async () => {
    if (confirm('آیا مطمئنی می‌خواهی از حساب کاربری خارج شوی؟')) {
      await supabase.auth.signOut();
      // ریدایرکت خودکار توسط App.tsx انجام می‌شود
    }
  };

  // --- حالت قفل (نمایش فرم رمز) ---
  if (!isUnlocked) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="bg-red-50 p-6 rounded-full mb-6 animate-bounce">
          <ShieldCheck size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-black mb-2 text-gray-800">بخش والدین 🛡️</h2>
        <p className="text-gray-500 mb-6 text-sm font-bold">برای ورود رمز ۴ رقمی را وارد کنید</p>
        
        <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-4">
          <div className="relative">
            <Lock className="absolute right-4 top-4 text-gray-400" size={20} />
            <input 
              type="tel" // کیبورد عددی در موبایل
              value={pin}
              onChange={e => setPin(e.target.value)}
              className="w-full text-center text-3xl font-black tracking-[0.5em] p-4 rounded-2xl border-2 border-gray-200 focus:border-red-500 outline-none transition-colors"
              placeholder="----"
              maxLength={4}
              autoFocus
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gray-800 text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
          >
            ورود به پنل
          </button>
        </form>

        {/* دکمه خروج کامل از اکانت */}
        <button 
          onClick={handleFullLogout} 
          className="mt-10 flex items-center gap-2 text-gray-400 font-bold text-sm hover:text-red-500 transition-colors p-2"
        >
          <LogOut size={16} />
          خروج کامل از حساب کاربری
        </button>
      </div>
    );
  }

  // --- حالت باز (پنل مدیریت) ---
  return (
    <div className="space-y-6 pb-24">
      {/* هدر پنل */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-b-4 border-gray-100">
        <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
          <ShieldCheck className="text-blue-500" />
          پنل مدیریت
        </h1>
        <button 
          onClick={() => setIsUnlocked(false)} 
          className="text-sm bg-red-50 text-red-500 px-3 py-1 rounded-lg font-bold border border-red-100"
        >
          قفل کردن 🔒
        </button>
      </div>

      {/* کارت افزودن وظیفه */}
      <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-200">
        <h3 className="font-bold text-lg text-blue-900 mb-2">افزودن وظیفه جدید 📝</h3>
        <p className="text-sm text-blue-700/70 mb-6 font-bold">
          می‌توانید برای امروز یا روزهای آینده یک وظیفه خاص تعریف کنید.
        </p>
        
        <button 
          onClick={() => setShowTaskModal(true)}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-blue-300 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Plus size={24} />
          افزودن وظیفه
        </button>
      </div>

      {/* یادداشت راهنما */}
      <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200">
        <p className="text-xs text-yellow-800 font-bold leading-relaxed text-center">
          💡 نکته: برای تایید جوایز خریداری شده توسط کودک، لطفاً به صفحه اصلی (داشبورد) مراجعه کنید.
        </p>
      </div>

      {/* مودال افزودن تسک */}
      {showTaskModal && (
        <AddTaskModal 
          date={selectedDate}
          onClose={() => setShowTaskModal(false)}
          onAdded={() => alert('وظیفه با موفقیت اضافه شد! ✅')}
        />
      )}
    </div>
  );
};