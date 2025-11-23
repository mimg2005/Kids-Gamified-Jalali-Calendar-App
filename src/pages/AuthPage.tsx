import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Lock, LogIn, UserPlus, ArrowRight, Mail, Calendar, Smile } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';

export const AuthPage = () => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  
  // فیلدهای مشترک
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // فیلدهای مخصوص ثبت نام
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [avatar, setAvatar] = useState('🦁'); // آواتار پیش‌فرض
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // لیست آواتارها برای انتخاب
  const avatars = ['🦁', '🦄', '🐲', '🐱', '🐼', '🐯', '🐸', '🐰', '🦊', '🐨'];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // اعتبارسنجی اولیه
    if (!email || !password) {
      setError('لطفاً ایمیل و رمز عبور را وارد کنید.');
      return;
    }

    if (password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
      return;
    }

    // اعتبارسنجی مخصوص ثبت نام
    if (mode === 'REGISTER') {
      if (!name) {
        setError('لطفاً نام قهرمان را وارد کنید.');
        return;
      }
      if (!age) {
        setError('لطفاً سن را وارد کنید.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'REGISTER') {
        // --- ثبت نام کامل ---
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name } }
        });

        if (signUpError) {
           setError(translateError(signUpError.message));
        } else if (data.user) {
          // ذخیره تمام اطلاعات (نام، سن، آواتار) در دیتابیس
          const { error: dbError } = await supabase.from('users').insert({
            id: data.user.id, 
            name: name,
            age: parseInt(age), // تبدیل متن به عدد
            avatar: avatar,     // آواتار انتخاب شده
            coins: 0, 
            xp: 0
          });
          
          if (dbError) {
            console.error('DB Error:', dbError);
            setError('خطا در ذخیره پروفایل.');
          }
          // هدایت خودکار انجام می‌شود
        }

      } else {
        // --- ورود ---
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          setError('ایمیل یا رمز عبور اشتباه است.');
        }
      }
    } catch (err) {
        setError('خطای غیرمنتظره رخ داد.');
    }
    setLoading(false);
  };

  // ترجمه خطاها
  const translateError = (msg: string) => {
    if (msg.includes('already registered')) return 'این ایمیل قبلاً ثبت‌نام شده است.';
    if (msg.includes('weak password')) return 'رمز عبور ضعیف است.';
    if (msg.includes('invalid email')) return 'فرمت ایمیل صحیح نیست.';
    return msg;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 py-10">
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white my-4">
        
        {/* هدر */}
        <div className="bg-yellow-400 p-6 text-center relative overflow-hidden">
          <Link to="/" className="absolute right-4 top-4 text-yellow-800 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors z-10">
             <ArrowRight size={20} />
          </Link>
          
          <div className="relative z-10">
            <div className="text-5xl mb-2 animate-bounce">
              {mode === 'LOGIN' ? '🔐' : avatar}
            </div>
            <h1 className="text-xl font-black text-yellow-900">
              {mode === 'LOGIN' ? 'ورود به حساب' : 'ساخت قهرمان جدید'}
            </h1>
          </div>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        <div className="p-6">
          {/* تب‌ها */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button 
              onClick={() => { setMode('LOGIN'); setError(''); }}
              className={clsx("flex-1 py-3 rounded-lg font-bold text-sm transition-all", mode === 'LOGIN' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600")}
            >
              ورود
            </button>
            <button 
              onClick={() => { setMode('REGISTER'); setError(''); }}
              className={clsx("flex-1 py-3 rounded-lg font-bold text-sm transition-all", mode === 'REGISTER' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600")}
            >
              ثبت نام
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* بخش‌های مخصوص ثبت نام */}
            {mode === 'REGISTER' && (
              <div className="space-y-4 animate-fade-in-down">
                
                {/* انتخاب آواتار */}
                <div>
                  <label className="block text-gray-500 font-bold text-xs mb-2 mr-1 flex items-center gap-1">
                    <Smile size={14}/> کاراکترت رو انتخاب کن:
                  </label>
                  <div className="grid grid-cols-5 gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                    {avatars.map(a => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAvatar(a)}
                        className={clsx(
                          "text-2xl p-1 rounded-lg transition-all hover:scale-125",
                          avatar === a ? "bg-blue-100 scale-110 border-2 border-blue-300 shadow-sm" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100"
                        )}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                    {/* نام */}
                    <div className="flex-[2]">
                        <label className="block text-gray-500 font-bold text-xs mb-1 mr-1">نام قهرمان</label>
                        <div className="relative">
                        <User className="absolute right-3 top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-2.5 pr-9 pl-3 focus:border-blue-500 outline-none font-bold text-gray-700 text-sm"
                            placeholder="آراد"
                        />
                        </div>
                    </div>
                    {/* سن */}
                    <div className="flex-1">
                        <label className="block text-gray-500 font-bold text-xs mb-1 mr-1">سن</label>
                        <div className="relative">
                        <Calendar className="absolute right-2 top-3 text-gray-400" size={18} />
                        <input
                            type="number"
                            value={age}
                            onChange={e => setAge(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-2.5 pr-8 pl-1 focus:border-blue-500 outline-none font-bold text-gray-700 text-center text-sm"
                            placeholder="۷"
                        />
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* ایمیل */}
            <div>
              <label className="block text-gray-500 font-bold text-xs mb-1 mr-1">ایمیل (انگلیسی)</label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pr-10 pl-3 focus:border-blue-500 outline-none font-bold text-gray-700 transition-all focus:bg-white ltr"
                  placeholder="email@example.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* رمز عبور */}
            <div>
              <label className="block text-gray-500 font-bold text-xs mb-1 mr-1">رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pr-10 pl-3 focus:border-blue-500 outline-none font-bold text-gray-700 transition-all focus:bg-white ltr"
                  placeholder="******"
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl text-center border border-red-100 flex items-center justify-center gap-2">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'صبر کن...' : (mode === 'LOGIN' ? <><LogIn size={20} /> ورود</> : <><UserPlus size={20} /> ساخت اکانت</>)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};