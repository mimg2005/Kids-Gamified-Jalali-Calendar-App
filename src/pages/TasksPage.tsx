import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJalaliNow, toGregorianString } from '../lib/jalali';
// ایمپورت‌های اضافی حذف شدند

export const TasksPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const now = getJalaliNow();
    const gDate = toGregorianString(now.jy, now.jm, now.jd);
    navigate(`/day/${gDate}`);
  }, []);

  return <div className="text-center pt-20 text-gray-400 font-bold">در حال انتقال به لیست وظایف... ⏳</div>;
};