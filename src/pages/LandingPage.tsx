import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, ShieldCheck, Gift, ArrowLeft } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    // هدایت به صفحه ورود/ثبت‌نام
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 text-white pb-20">
      
      {/* Hero Section */}
      <div className="pt-20 px-6 text-center relative overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-[-50px] w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-40 left-[-50px] w-32 h-32 bg-blue-300/20 rounded-full blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-7xl mb-4 animate-bounce">🚀</div>
          <h1 className="text-4xl font-black mb-4 leading-tight">
            تبدیل کارهای روزانه <br/> به <span className="text-yellow-300">بازی و جایزه!</span>
          </h1>
          <p className="text-lg opacity-90 mb-8 font-bold max-w-md mx-auto">
            قهرمان کوچولو! وظایفت رو انجام بده، سکه جمع کن و جایزه‌های واقعی بگیر.
          </p>
          
          <button
            onClick={handleStart}
            className="bg-yellow-400 text-yellow-900 text-xl font-black py-4 px-10 rounded-full shadow-xl shadow-yellow-400/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto"
          >
            بزن بریم!
            <ArrowLeft />
          </button>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="px-4 mt-16 max-w-md mx-auto space-y-4">
        <h2 className="text-center font-bold text-2xl mb-6 opacity-90">چرا اینجا خیلی خوش می‌گذره؟</h2>
        
        <FeatureCard 
          icon={<CheckCircle2 size={32} className="text-green-500" />}
          title="وظایف روزانه"
          desc="لیست کارهات همیشه جلو چشمته، تیک بزن و حالشو ببر!"
          delay={0.2}
        />
        <FeatureCard 
          icon={<Gift size={32} className="text-pink-500" />}
          title="فروشگاه جوایز"
          desc="با سکه‌هایی که جمع کردی، بستنی، اسباب‌بازی یا شهربازی بخر!"
          delay={0.4}
        />
        <FeatureCard 
          icon={<Star size={32} className="text-yellow-500" />}
          title="لول آپ شو!"
          desc="از «کاوشگر» شروع کن و به «قهرمان کهکشانی» برس."
          delay={0.6}
        />
        <FeatureCard 
          icon={<ShieldCheck size={32} className="text-blue-500" />}
          title="مخصوص والدین"
          desc="پدر و مادرها می‌تونن وظایف رو مدیریت کنن و پیشرفتت رو ببینن."
          delay={0.8}
        />
      </div>

      {/* Footer CTA */}
      <div className="mt-16 text-center px-6">
        <p className="font-bold opacity-80 mb-4">هنوز منتظری؟</p>
        <button
          onClick={handleStart}
          className="w-full max-w-xs bg-white text-purple-700 font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          شروع رایگان و سریع ✨
        </button>
        <p className="text-xs mt-6 opacity-50">طراحی شده برای قهرمان‌های آینده</p>
      </div>
    </div>
  );
};

// کامپوننت کارت ویژگی
const FeatureCard = ({ icon, title, desc, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4"
  >
    <div className="bg-white p-3 rounded-xl shadow-sm">
      {icon}
    </div>
    <div className="text-right">
      <h3 className="font-black text-lg">{title}</h3>
      <p className="text-sm opacity-80 leading-tight">{desc}</p>
    </div>
  </motion.div>
);