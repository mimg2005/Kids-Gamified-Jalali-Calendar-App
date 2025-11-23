import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Props {
  onClose: () => void;
  onAdded: () => void;
}

export const AddRewardModal = ({ onClose, onAdded }: Props) => {
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [emoji, setEmoji] = useState('🎁');
  const [loading, setLoading] = useState(false);

  const emojis = ['🍕', '🍦', '🎮', '⚽', '🚲', '🎨', '🧸', '📱', '🍟', '🍿', '🏊‍♂️', '🎡'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('rewards').insert({
      user_id: user.id,
      title,
      cost: parseInt(cost),
      emoji
    });

    setLoading(false);
    onAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border-4 border-purple-200">
        <h2 className="text-xl font-bold mb-4 text-gray-700 text-center">جایزه جدید تعریف کن!</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* انتخاب ایموجی */}
          <div className="grid grid-cols-6 gap-2 bg-gray-50 p-2 rounded-xl">
            {emojis.map(e => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`text-2xl p-1 rounded-lg transition-transform hover:scale-125 ${emoji === e ? 'bg-purple-200 scale-110' : ''}`}
              >
                {e}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="نام جایزه (مثلا: بستنی)"
            className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-purple-500 outline-none text-lg font-bold"
            required
          />
          
          <input
            type="number"
            value={cost}
            onChange={e => setCost(e.target.value)}
            placeholder="امتیاز مورد نیاز (مثلا: ۵۰)"
            className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-purple-500 outline-none text-lg font-bold"
            required
          />

          <div className="flex gap-2 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold">
              بی‌خیال
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-purple-500 text-white font-bold shadow-lg">
              {loading ? '...' : 'ثبت جایزه'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};