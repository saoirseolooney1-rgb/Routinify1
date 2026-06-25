import { FC, useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CelebrationBannerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const CelebrationBanner: FC<CelebrationBannerProps> = ({ isOpen, onClose, title, message }) => {
  const [confetti, setConfetti] = useState<{ id: number; left: number; delay: number; color: string; duration: number }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const colors = ['#14b8a6', '#0ea5e9', '#f59e0b', '#8b5cf6', '#22c55e', '#ec4899'];
      const newConfetti = Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setConfetti(newConfetti);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute top-[-20px] w-3 h-6 rounded-sm opacity-80"
          style={{
            left: `${c.left}%`,
            backgroundColor: c.color,
            animation: `fall ${c.duration}s linear ${c.delay}s forwards`,
          }}
        />
      ))}

      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center relative overflow-hidden animate-in zoom-in duration-300">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400" />
        
        <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6" style={{ animation: 'bounceAnim 1s ease-in-out infinite alternate' }}>
          <Star className="w-12 h-12 text-yellow-500 fill-yellow-500" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-serif" style={{ fontFamily: 'Fraunces, serif' }}>{title}</h2>
        <p className="text-lg text-gray-600 mb-8">{message}</p>
        
        <Button 
          onClick={onClose} 
          className="w-full sm:w-auto px-8 py-6 rounded-xl bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
