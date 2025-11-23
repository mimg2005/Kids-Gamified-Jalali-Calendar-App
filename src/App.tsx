import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardHome } from './pages/DashboardHome';
import { CalendarPage } from './pages/CalendarPage';
import { DayPage } from './pages/DayPage';
import { TasksPage } from './pages/TasksPage';
import { RewardsPage } from './pages/RewardsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ParentsPage } from './pages/ParentsPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage'; // ایمپورت جدید
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-4xl animate-spin">⏳</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* مسیرهای عمومی (بدون نیاز به لاگین) */}
        {/* اگر کاربر لاگین باشد و به این صفحات برود، خودکار به داشبورد هدایت می‌شود */}
        <Route path="/" element={!session ? <LandingPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/auth" element={!session ? <AuthPage /> : <Navigate to="/dashboard" replace />} />

        {/* مسیرهای خصوصی (نیاز به لاگین) */}
        {session && (
          <Route element={<Layout><div/></Layout>}> {/* Layout wrapper */}
             {/* نکته: Layout را دور تک تک روت‌ها می‌پیچیم یا اینجا به صورت والد */}
          </Route>
        )}
        
        {/* تعریف دستی روت‌های خصوصی با Layout */}
        <Route path="/dashboard" element={session ? <Layout><DashboardHome /></Layout> : <Navigate to="/auth" />} />
        <Route path="/calendar" element={session ? <Layout><CalendarPage /></Layout> : <Navigate to="/auth" />} />
        <Route path="/tasks" element={session ? <Layout><TasksPage /></Layout> : <Navigate to="/auth" />} />
        <Route path="/day/:date" element={session ? <Layout><DayPage /></Layout> : <Navigate to="/auth" />} />
        <Route path="/rewards" element={session ? <Layout><RewardsPage /></Layout> : <Navigate to="/auth" />} />
        <Route path="/achievements" element={session ? <Layout><AchievementsPage /></Layout> : <Navigate to="/auth" />} />
        <Route path="/leaderboard" element={session ? <Layout><LeaderboardPage /></Layout> : <Navigate to="/auth" />} />
        <Route path="/parents" element={session ? <Layout><ParentsPage /></Layout> : <Navigate to="/auth" />} />
        <Route path="/onboarding" element={session ? <OnboardingPage onComplete={() => window.location.href = '/dashboard'} /> : <Navigate to="/auth" />} />

        {/* هر مسیر اشتباهی برود به خانه */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;