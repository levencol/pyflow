import { useEffect, useState } from 'react';
import { Sparkles, Star } from 'lucide-react';

interface PointsToastProps {
  points: number;
  label?: string;
  onDone?: () => void;
}

export function PointsToast({ points, label, onDone }: PointsToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDone?.(), 400);
    }, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] transition-all duration-400 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ pointerEvents: 'none' }}
    >
      <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-indigo-400/30 backdrop-blur-sm">
        <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Sparkles className="h-4.5 w-4.5 text-yellow-300 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-yellow-300 fill-current" />
            <span className="font-black text-xl font-mono">+{points} pts</span>
          </div>
          {label && (
            <p className="text-[11px] text-indigo-200 font-medium mt-0.5">{label}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook to manage toast queue
import { useCallback, useRef } from 'react';

interface ToastItem {
  id: number;
  points: number;
  label?: string;
}

export function usePointsToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const showPoints = useCallback((points: number, label?: string) => {
    const id = nextId.current++;
    setToasts(prev => [...prev, { id, points, label }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const ToastContainer = () => (
    <>
      {toasts.map((toast, idx) => (
        <div
          key={toast.id}
          style={{ bottom: `${1.5 + idx * 5}rem` }}
          className="fixed right-6 z-[9999]"
        >
          <PointsToast
            points={toast.points}
            label={toast.label}
            onDone={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  );

  return { showPoints, ToastContainer };
}
