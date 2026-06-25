import { useState, useEffect, FC } from "react";
import { Play, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CelebrationBanner } from "@/components/CelebrationBanner";

interface FocusTimerProps {}

export const FocusTimer: FC<FocusTimerProps> = () => {
  const [minutes, setMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setShowCelebration(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handlePreset = (mins: number) => {
    setMinutes(mins);
    setTimeLeft(mins * 60);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    if (timeLeft === 0 && !isRunning) {
      setTimeLeft(minutes * 60);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft / (minutes * 60);
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col items-center animate-in fade-in duration-500">
      <CelebrationBanner 
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        title="Session Complete!"
        message="Great focus everyone."
      />

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-teal-900 mb-2">Focus Timer</h2>
        <p className="text-teal-700">Set the block duration</p>
      </div>

      <Card className="p-8 bg-white rounded-[3rem] shadow-sm border-teal-100 flex flex-col items-center w-full max-w-lg mb-8">
        <div className="relative w-[320px] h-[320px] mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="160"
              cy="160"
              r={radius}
              className="stroke-teal-50 fill-none"
              strokeWidth="16"
            />
            <circle
              cx="160"
              cy="160"
              r={radius}
              className="stroke-teal-500 fill-none transition-all duration-1000 ease-linear"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-bold text-teal-950 font-mono tracking-tighter">
              {formatTime(timeLeft)}
            </span>
            <span className="text-teal-600 mt-2 font-medium">
              {isRunning ? "Focusing..." : timeLeft === 0 ? "Done" : "Ready"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[25, 15, 10, 5].map((preset) => (
            <Button
              key={preset}
              variant={minutes === preset ? "default" : "outline"}
              className={`rounded-xl px-6 ${minutes === preset ? 'bg-teal-600 hover:bg-teal-700' : 'text-teal-700 border-teal-200 hover:bg-teal-50'}`}
              onClick={() => handlePreset(preset)}
            >
              {preset} min
            </Button>
          ))}
          <div className="flex items-center gap-2 px-3 border border-teal-200 rounded-xl">
            <input 
              type="number" 
              value={minutes}
              onChange={(e) => handlePreset(Math.max(1, Math.min(120, parseInt(e.target.value) || 1)))}
              className="w-12 text-center text-teal-900 outline-none font-medium bg-transparent"
              min="1" max="120"
            />
            <span className="text-sm font-medium text-teal-700 pr-2">min</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={toggleTimer} 
            className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white shadow-lg hover:shadow-xl transition-all"
          >
            {isRunning ? <Square className="w-5 h-5 mr-2" fill="currentColor" /> : <Play className="w-5 h-5 mr-2" fill="currentColor" />}
            {isRunning ? "Stop" : "Start"}
          </Button>
          <Button 
            onClick={resetTimer}
            variant="outline"
            className="rounded-full px-6 py-6 border-teal-200 text-teal-700 hover:bg-teal-50"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
