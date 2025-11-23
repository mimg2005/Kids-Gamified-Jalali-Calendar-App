import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Lock, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';

export const AuthPage = () => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const SALT = 'kidsapp_secure_pass';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim() || pin.length !== 5) {
      setError('نام را بنویسید و رمز حتماً باید ۵ رقم باشد.');
      return;
    }

    setLoading(true);
    const cleanName = name.trim().replace(/\s+/g, '').toLowerCase();
    const email = `${cleanName}@kids.app`;
    const password = pin + SALT;

    try {
      if (mode === 'REGISTER') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name } }
        });

        if (signUpError) {
           // مدیریت خطاها
           if (signUpError.message.includes('already registered')) setError('این نام قبلاً گرفته شده.');
           else setError(signUpError.message);
        } else if (data.user) {
          await supabase.from('users').insert({
            id: data.user.id, name: name, coins: 0, xp: 0, avatar: '🐻'
          });
          // بعد از ثبت نام موفق، خودکار میره به داشبورد (چون App.tsx ریدایرکت میکنه)
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email, password
        });
        if (signInError) setError('نام کاربری یا رمز عبور اشتباه است.');
      }
    } catch (err) {
        setError('خطای غیرمنتظره رخ داد.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden">
        
        {/* هدر */}
        <div className="bg-yellow-400 p-6 text-center relative">
          <Link to="/" className="absolute right-4 top-4 text-yellow-800 bg-yellow-200/50 p-2 rounded-full hover:bg-yellow-200">
             <ArrowRight size={20} />
          </Link>
          <div className="text-5xl mb-2">🔐</div>
          <h1 className="text-xl font-black text-yellow-900">ورود به حساب</h1>
        </div>

        <div className="p-6">
          {/* تب‌ها */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button 
              onClick={() => { setMode('LOGIN'); setError(''); }}
              className={clsx("flex-1 py-2 rounded-lg font-bold text-sm transition-all", mode === 'LOGIN' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400")}
            >
              ورود
            </button>
            <button 
              onClick={() => { setMode('REGISTER'); setError(''); }}
              className={clsx("flex-1 py-2 rounded-lg font-bold text-sm transition-all", mode === 'REGISTER' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400")}
            >
              ثبت نام
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-gray-500 font-bold text-xs mb-1 mr-1">نام شما</label>
              <div className="relative">
                <User className="absolute right-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pr-10 pl-3 focus:border-blue-500 outline-none font-bold text-gray-700"
                  placeholder="مثلا: آراد"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 font-bold text-xs mb-1 mr-1">رمز ۵ رقمی</label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 text-gray-400" size={20} />
                <input
                  type="tel"
                  maxLength={5}
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pr-10 pl-3 focus:border-blue-500 outline-none font-black text-xl tracking-[0.5em] text-center text-gray-700 placeholder-gray-300"
                  placeholder="-----"
                />
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl text-center border border-red-100">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              {loading ? '...' : (mode === 'LOGIN' ? <><LogIn size={20} /> وارد شو</> : <><UserPlus size={20} /> ثبت نام</>)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};