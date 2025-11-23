import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // ایمپورت
import { BottomMenu } from './BottomMenu';

export const Layout = ({ children }: { children: ReactNode }) => {
  // استیت برای ذخیره اطلاعات پروفایل
  const [profile, setProfile] = useState<{ name: string, avatar: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('name, avatar')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 font-sans pb-10 dir-rtl">
      <header className="bg-white shadow-sm border-b-4 border-blue-200 p-4 sticky top-0 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-2xl font-bold text-blue-600 no-underline">
              📅
            </Link>
            {/* اگر پروفایل لود شده بود، اسم و عکسش را نشان بده */}
            {profile && (
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <span className="text-xl">{profile.avatar}</span>
                <span className="font-bold text-blue-800 text-sm">{profile.name}</span>
              </div>
            )}
          </div>

          <Link to="/rewards" className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold border-2 border-yellow-300 hover:bg-yellow-200 transition-colors cursor-pointer flex items-center gap-1">
            <span>🏆</span>
            <span>جایزه!</span>
          </Link>
        </div>
      </header>
      <main className="max-w-md mx-auto p-4">
        {children}
      </main>
      <BottomMenu />
    </div>
  );
};