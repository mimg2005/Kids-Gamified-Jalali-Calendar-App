import { useState } from 'react';
import { supabase } from '../lib/supabase';
// ایمپورت بدون استفاده حذف شد

interface Props {
  onComplete: () => void;
}

export const OnboardingPage = ({ onComplete }: Props) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [avatar, setAvatar] = useState('🐻');
  const [loading, setLoading] = useState(false);

  const avatars = ['🐻', '🐰', '🐱', '🐶', '🦁', '🐸', '🦄', '🐼', '🐨', '🐯'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase.from('users').upsert({
        id: user.id,
        name: name,
        age: parseInt(age),
        avatar: avatar,
        created_at: new Date().toISOString()
      });

      if (!error) {
        onComplete();
      } else {
        console.error(error);
        alert('مشکلی پیش آمد!');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl border-b-8 border-blue-200">
        <h1 className="text-3xl font-black text-center text-blue-600 mb-2">خوش اومدی! 👋</h1>
        <p className="text-center text-gray-500 mb-8 font-bold">اطلاعات خودت رو وارد کن</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-center">یکی رو انتخاب کن:</label>
            <div className="grid grid-cols-5 gap-2">
              {avatars.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`text-3xl p-2 rounded-xl transition-all ${avatar === a ? 'bg-blue-100 scale-110 border-2 border-blue-400' : 'grayscale opacity-50 hover:opacity-100 hover:grayscale-0'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">اسمت چیه؟</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-xl font-bold focus:border-blue-500 outline-none text-center"
              placeholder="مثلا: آراد"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">چند سالته؟</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-xl font-bold focus:border-blue-500 outline-none text-center"
              placeholder="مثلا: ۷"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl text-xl font-black shadow-lg active:scale-95 transition-transform"
          >
            {loading ? 'صبر کن...' : 'بزن بریم! 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
};