import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Lock, LogIn, UserPlus, ArrowRight, Mail } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';

export const AuthPage = () => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // فقط برای ثبت نام
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // اعتبارسنجی اولیه
    if (!email || !password) {
      setError('لطفاً ایمیل و رمز عبور را وارد کنید.');
      return;
    }

    if (mode === 'REGISTER' && !name) {
      setError('لطفاً نام خود را وارد کنید.');
      return;
    }

    if (password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'REGISTER') {
        // --- ثبت نام ---
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name } }
        });

        if (signUpError) {
           setError(translateError(signUpError.message));
        } else if (data.user) {
          // ساخت پروفایل در جدول users
          const { error: dbError } = await supabase.from('users').insert({
            id: data.user.id, 
            name: name, 
            coins: 0, 
            xp: 0, 
            avatar: '👤'
          });
          
          if (dbError) console.error('DB Error:', dbError);
          // هدایت خودکار انجام می‌شود (چون App.tsx وضعیت را گوش می‌دهد)
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

  // ترجمه خطاهای رایج انگلیسی به فارسی
  const translateError = (msg: string) => {
    if (msg.includes('already registered')) return 'این ایمیل قبلاً ثبت‌نام شده است.';
    if (msg.includes('weak password')) return 'رمز عبور ضعیف است.';
    if (msg.includes('invalid email')) return 'فرمت ایمیل صحیح نیست.';
    return msg;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white">
        
        {/* هدر */}
        <div className="bg-yellow-400 p-6 text-center relative overflow-hidden">
          {/* دکمه بازگشت */}
          <Link to="/" className="absolute right-4 top-4 text-yellow-800 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors z-10">
             <ArrowRight size={20} />
          </Link>
          
          <div className="relative z-10">
            <div className="text-5xl mb-2 animate-bounce">🔐</div>
            <h1 className="text-xl font-black text-yellow-900">
              {mode === 'LOGIN' ? 'ورود به حساب' : 'ساخت حساب جدید'}
            </h1>
          </div>
          
          {/* پترن پس‌زمینه هدر */}
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
            
            {/* فیلد نام (فقط در ثبت نام) */}
            {mode === 'REGISTER' && (
              <div className="animate-fade-in-down">
                <label className="block text-gray-500 font-bold text-xs mb-1 mr-1">نام شما (فارسی)</label>
                <div className="relative">
                  <User className="absolute right-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pr-10 pl-3 focus:border-blue-500 outline-none font-bold text-gray-700 transition-all focus:bg-white"
                    placeholder="مثلا: آراد"
                  />
                </div>
              </div>
            )}

            {/* فیلد ایمیل */}
            <div>
              <label className="block text-gray-500 font-bold text-xs mb-1 mr-1">ایمیل (انگلیسی)</label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pr-10 pl-3 focus:border-blue-500 outline-none font-bold text-gray-700 transition-all focus:bg-white ltr"
                  placeholder="arad@example.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* فیلد رمز عبور */}
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

            {/* نمایش خطا */}
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
              {loading ? 'صبر کن...' : (mode === 'LOGIN' ? <><LogIn size={20} /> بزن بریم داخل!</> : <><UserPlus size={20} /> ساخت اکانت</>)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};