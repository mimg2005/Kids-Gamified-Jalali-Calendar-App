import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, CheckSquare, Trophy, ShoppingBag, Users, ShieldCheck, Gamepad2 } from 'lucide-react';
import clsx from 'clsx';

export const BottomMenu = () => {
  const location = useLocation();
  const current = location.pathname;

  const menuItems = [
    { icon: <Home size={20} />, label: 'خانه', path: '/dashboard' },
    { icon: <Calendar size={20} />, label: 'تقویم', path: '/calendar' },
    { icon: <CheckSquare size={20} />, label: 'وظایف', path: '/tasks' },
    //{ icon: <Gamepad2 size={20} />, label: 'ماموریت', path: '/missions' },
    { icon: <Trophy size={20} />, label: 'دستاورد', path: '/achievements' },
    { icon: <ShoppingBag size={20} />, label: 'جوایز', path: '/rewards' },
    { icon: <Users size={20} />, label: 'رتبه‌ها', path: '/leaderboard' },
    { icon: <ShieldCheck size={20} />, label: 'والدین', path: '/parents' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 shadow-2xl z-50 pb-safe">
      <div className="flex overflow-x-auto no-scrollbar py-2 px-1 justify-between gap-1 max-w-md mx-auto">
        {menuItems.map((item) => {
          const isActive = current === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex flex-col items-center justify-center min-w-[60px] p-2 rounded-xl transition-all",
                isActive ? "bg-blue-100 text-blue-600 scale-105" : "text-gray-400 hover:bg-gray-50"
              )}
            >
              <div className="mb-1">{item.icon}</div>
              <span className="text-[9px] font-bold whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};