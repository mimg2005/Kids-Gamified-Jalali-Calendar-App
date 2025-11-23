import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getJalaliNow, 
  daysOfWeek, 
  getDaysInMonth, 
  getFirstDayOfWeek, 
  monthNames, 
  toGregorianString,
  toPersianDigits // <--- ایمپورت جدید
} from '../lib/jalali';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface DayScore {
  date: string;
  total_points: number;
}

export const CalendarPage = () => {
  const navigate = useNavigate();
  const now = getJalaliNow();
  const [viewYear, setViewYear] = useState(now.jy);
  const [viewMonth, setViewMonth] = useState(now.jm);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const startDayOfWeek = getFirstDayOfWeek(viewYear, viewMonth);
  const totalCells = Math.ceil((daysInMonth + startDayOfWeek) / 7) * 7;

  useEffect(() => {
    fetchScores();
  }, [viewYear, viewMonth]);

  const fetchScores = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const startG = toGregorianString(viewYear, viewMonth, 1);
    const endG = toGregorianString(viewYear, viewMonth, daysInMonth);

    const { data } = await supabase
      .from('daily_scores')
      .select('date, total_points')
      .eq('user_id', user.id)
      .gte('date', startG)
      .lte('date', endG);

    const scoreMap: Record<string, number> = {};
    let mTotal = 0;
    data?.forEach((item: DayScore) => {
      scoreMap[item.date] = item.total_points;
      mTotal += item.total_points;
    });

    setScores(scoreMap);
    setMonthlyTotal(mTotal);
  };

  const handleDayClick = (d: number) => {
    const gDate = toGregorianString(viewYear, viewMonth, d);
    navigate(`/day/${gDate}`);
  };

  const nextMonth = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };
  const prevMonth = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 shadow-lg flex items-center justify-between border-b-4 border-gray-100">
        <button onClick={prevMonth} className="p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200">
          <ChevronRight />
        </button>
        <div className="text-center">
          {/* نمایش فارسی سال */}
          <h1 className="text-2xl font-black text-gray-800">{monthNames[viewMonth - 1]} {toPersianDigits(viewYear)}</h1>
          {/* نمایش فارسی امتیاز کل */}
          <span className="text-sm font-bold text-green-500">امتیاز کل ماه: {toPersianDigits(monthlyTotal)}</span>
        </div>
        <button onClick={nextMonth} className="p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200">
          <ChevronLeft />
        </button>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-3xl p-4 shadow-xl border-2 border-blue-100">
        <div className="grid grid-cols-7 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-xs text-gray-400 font-bold py-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: totalCells }).map((_, i) => {
            const dayNum = i - startDayOfWeek + 1;
            const isValid = dayNum > 0 && dayNum <= daysInMonth;
            
            if (!isValid) return <div key={i} />;

            const gDate = isValid ? toGregorianString(viewYear, viewMonth, dayNum) : '';
            const score = scores[gDate] || 0;
            
            let bgClass = "bg-gray-50 border-gray-100";
            if (score > 0) bgClass = "bg-yellow-50 border-yellow-200";
            if (score > 30) bgClass = "bg-orange-100 border-orange-300";
            if (score > 60) bgClass = "bg-green-100 border-green-300";

            return (
              <div
                key={i}
                onClick={() => handleDayClick(dayNum)}
                className={clsx(
                  "aspect-square rounded-2xl border-b-4 flex flex-col items-center justify-center cursor-pointer active:scale-90 transition-all relative overflow-hidden",
                  bgClass
                )}
              >
                {/* نمایش فارسی روز */}
                <span className="text-lg font-bold text-gray-700 z-10">{toPersianDigits(dayNum)}</span>
                {score > 0 && (
                  // نمایش فارسی امتیاز روز
                  <span className="text-[10px] bg-white/80 px-2 rounded-full font-bold text-orange-600 z-10 mt-1">
                    {toPersianDigits(score)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};