import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Star, Clock } from 'lucide-react';

interface Props {
  date: string; // تاریخی که روی تقویم کلیک شده (تاریخ شروع)
  onClose: () => void;
  onAdded: () => void;
}

export const AddTaskModal = ({ date, onClose, onAdded }: Props) => {
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState('10'); // پیش‌فرض ۱۰ امتیاز
  const [deadline, setDeadline] = useState(date); // پیش‌فرض همان روز
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !points) return;
    
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        alert("لطفا ابتدا وارد شوید");
        setLoading(false);
        return;
    }

    await supabase.from('tasks').insert({
      user_id: user.id,
      title,
      points: parseInt(points),
      date: date,     // تاریخ شروع (برای نمایش در تقویم)
      deadline: deadline, // مهلت انجام
      is_done: false
    });

    setLoading(false);
    onAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border-4 border-blue-200 animate-bounce-in">
        <h2 className="text-xl font-black mb-6 text-gray-700 text-center flex items-center justify-center gap-2">
          <span className="text-2xl">📝</span>
          وظیفه جدید
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* عنوان وظیفه */}
          <div>
            <label className="block text-gray-500 font-bold text-sm mb-1 mr-1">چه کاری باید انجام بشه؟</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="مثلا: مرتب کردن اتاق..."
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 outline-none text-lg font-bold"
              autoFocus
              required
            />
          </div>

          <div className="flex gap-3">
            {/* امتیاز */}
            <div className="flex-1">
              <label className="block text-gray-500 font-bold text-sm mb-1 mr-1 flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-yellow-500"/> امتیاز (Coin)
              </label>
              <input
                type="number"
                value={points}
                onChange={e => setPoints(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-yellow-400 outline-none text-lg font-black text-center text-yellow-600 bg-yellow-50"
                min="1"
                required
              />
              <p className="text-[10px] text-gray-400 mt-1 text-center font-bold">
                XP دریافتی: {parseInt(points || '0') * 2}
              </p>
            </div>

            {/* مهلت انجام */}
            <div className="flex-1">
              <label className="block text-gray-500 font-bold text-sm mb-1 mr-1 flex items-center gap-1">
                <Clock size={14} className="text-red-400"/> مهلت انجام
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 outline-none text-sm font-bold text-center"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
            >
              لغو
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3 rounded-xl bg-blue-600 text-white font-bold shadow-blue-300 shadow-lg active:scale-95 transition-transform"
            >
              {loading ? '...' : 'ثبت وظیفه ✅'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};