import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatJalaliDate, toPersianDigits } from '../lib/jalali';
import { AddTaskModal } from '../components/AddTaskModal';
import { StarExplosion } from '../components/StarExplosion';
import { ArrowRight, Trash2, CheckCircle, Circle, Star, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface Task {
  id: string;
  title: string;
  points: number;
  is_done: boolean;
}

export const DayPage = () => {
  const { date } = useParams<{ date: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [celebratingId, setCelebratingId] = useState<string | null>(null);

  const fetchTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !date) return;

    // فراخوانی تابع هوشمند (که وظایف پیش‌فرض را می‌سازد)
    const { data, error } = await supabase.rpc('get_or_create_daily_tasks', {
      target_date: date,
      target_user_id: user.id
    });
    
    if (error) console.error(error);
    if (data) setTasks(data as Task[]);
  };

  useEffect(() => {
    fetchTasks();
  }, [date]);

  const toggleTask = async (task: Task) => {
    const newStatus = !task.is_done;
    
    // آپدیت سریع در ظاهر
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, is_done: newStatus } : t));

    if (newStatus) {
      setCelebratingId(task.id);
      setTimeout(() => setCelebratingId(null), 1000);
    }

    await supabase.from('tasks').update({ is_done: newStatus }).eq('id', task.id);
  };

  const deleteTask = async (id: string) => {
    if(!confirm('آیا مطمئنی؟')) return;
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="pb-32">
      {/* هدر */}
      <div className="relative flex items-center justify-center mb-6 min-h-[50px]">
        <Link 
          to="/dashboard" 
          className="absolute right-0 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-blue-600 hover:scale-110 transition-all z-10"
        >
          <ArrowRight size={24} />
        </Link>
        <h1 className="text-2xl font-black text-gray-800">
          {date ? formatJalaliDate(date) : ''}
        </h1>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={clsx(
                "relative bg-white p-4 rounded-2xl shadow-sm border-b-4 flex items-center justify-between transition-all",
                task.is_done 
                  ? "border-green-200 bg-green-50 opacity-80" 
                  : "border-gray-200 hover:border-blue-200"
              )}
            >
              {celebratingId === task.id && <StarExplosion />}
              
              <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleTask(task)}>
                <div className={clsx("text-2xl transition-transform duration-300 flex-shrink-0", task.is_done ? "text-green-500 scale-110" : "text-gray-300")}>
                  {task.is_done ? <CheckCircle size={32} fill="#dcfce7" /> : <Circle size={32} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={clsx("font-bold text-lg truncate", task.is_done ? "text-gray-400 line-through" : "text-gray-700")}>
                    {task.title}
                  </p>
                  
                  {/* نمایش امتیاز و XP */}
                  <div className="flex items-center gap-2 mt-1">
                    {/* سکه */}
                    <span className={clsx(
                      "text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1",
                      task.is_done ? "bg-gray-200 text-gray-500" : "bg-yellow-100 text-yellow-700"
                    )}>
                      <Star size={10} className="fill-current" /> 
                      {toPersianDigits(task.points)} سکه
                    </span>

                    {/* XP (محاسبه دو برابر) */}
                    <span className={clsx(
                      "text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1",
                      task.is_done ? "bg-gray-200 text-gray-500" : "bg-blue-100 text-blue-700"
                    )}>
                      <Zap size={10} className="fill-current" /> 
                      {toPersianDigits(task.points * 2)} XP
                    </span>
                  </div>
                </div>
              </div>

              <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            درحال دریافت ماموریت‌ها... 🚀
          </div>
        )}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 left-6 right-6 bg-blue-500 text-white py-4 rounded-2xl font-black text-xl shadow-blue-300 shadow-xl active:scale-95 transition-transform z-40"
      >
        + افزودن کار ویژه
      </button>

      {showModal && date && (
        <AddTaskModal 
          date={date} 
          onClose={() => setShowModal(false)} 
          onAdded={fetchTasks} 
        />
      )}
    </div>
  );
};