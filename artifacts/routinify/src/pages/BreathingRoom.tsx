import { useState, useEffect, FC } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Square } from "lucide-react";

export const BreathingRoom: FC = () => {
  const [tab, setTab] = useState<'butterfly' | 'box'>(() => {
    const saved = localStorage.getItem('routinify-breathing-tab');
    return (saved === 'butterfly' || saved === 'box') ? saved : 'butterfly';
  });
  const [isActive, setIsActive] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    localStorage.setItem('routinify-breathing-tab', tab);
  }, [tab]);

  useEffect(() => {
    setIsActive(false);
    setCycle(0);
  }, [tab]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setCycle((prev) => prev + 1);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const butterflyState = cycle % 2 === 0 ? "Breathe in slowly" : "Breathe out gently";
  
  const boxStates = ["Inhale", "Hold", "Exhale", "Hold"];
  const boxState = boxStates[cycle % 4];

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-teal-900 mb-2">Breathing Room</h2>
        <p className="text-teal-700">Guided regulation exercises</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-full p-1 border border-teal-100 shadow-sm inline-flex">
          <button 
            className={`px-6 py-2 rounded-full font-medium transition-all ${tab === 'butterfly' ? 'bg-green-100 text-green-800' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setTab('butterfly')}
          >
            Butterfly Breathing
          </button>
          <button 
            className={`px-6 py-2 rounded-full font-medium transition-all ${tab === 'box' ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setTab('box')}
          >
            Box Breathing
          </button>
        </div>
      </div>

      <Card className="p-12 bg-white rounded-[3rem] shadow-sm border-teal-100 max-w-2xl mx-auto overflow-hidden text-center relative min-h-[500px] flex flex-col items-center justify-center">
        {tab === 'butterfly' ? (
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
              <div className="absolute inset-0 bg-green-50 rounded-full blur-2xl opacity-50"></div>
              {/* Butterfly SVG */}
              <svg width="200" height="200" viewBox="0 0 200 200" className="relative z-10">
                <ellipse cx="100" cy="100" rx="8" ry="40" fill="#166534" />
                <path 
                  d="M100 80 C60 20, 20 60, 100 120 Z" 
                  fill="#4ade80" opacity="0.8"
                  className="origin-center"
                  style={{ transform: isActive && cycle % 2 === 0 ? 'scale(1.1) rotate(-5deg)' : 'scale(0.9)', transition: 'transform 4s ease-in-out' }}
                />
                <path 
                  d="M100 80 C140 20, 180 60, 100 120 Z" 
                  fill="#4ade80" opacity="0.8"
                  className="origin-center"
                  style={{ transform: isActive && cycle % 2 === 0 ? 'scale(1.1) rotate(5deg)' : 'scale(0.9)', transition: 'transform 4s ease-in-out' }}
                />
                <path 
                  d="M100 120 C70 180, 40 150, 100 140 Z" 
                  fill="#22c55e" opacity="0.9"
                  className="origin-center"
                  style={{ transform: isActive && cycle % 2 === 0 ? 'scale(1.2)' : 'scale(0.8)', transition: 'transform 4s ease-in-out' }}
                />
                <path 
                  d="M100 120 C130 180, 160 150, 100 140 Z" 
                  fill="#22c55e" opacity="0.9"
                  className="origin-center"
                  style={{ transform: isActive && cycle % 2 === 0 ? 'scale(1.2)' : 'scale(0.8)', transition: 'transform 4s ease-in-out' }}
                />
              </svg>
            </div>
            <h3 className="text-3xl font-medium text-green-800 mb-4 h-10 transition-all duration-1000">
              {isActive ? butterflyState : "Ready"}
            </h3>
            <p className="text-green-600/70 mb-8">Follow the wings as they expand and contract.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
              <div className="absolute inset-0 bg-blue-50 rounded-full blur-2xl opacity-50"></div>
              <svg width="200" height="200" viewBox="0 0 200 200" className="relative z-10">
                <rect x="40" y="40" width="120" height="120" fill="none" stroke="#93c5fd" strokeWidth="4" strokeDasharray="8 8" rx="16" />
                <rect 
                  x="60" y="60" width="80" height="80" 
                  fill="#3b82f6" 
                  rx="12"
                  style={{ 
                    transformOrigin: 'center',
                    transform: isActive ? (cycle % 4 === 0 || cycle % 4 === 1 ? 'scale(1.4)' : 'scale(1)') : 'scale(1)',
                    opacity: isActive ? (cycle % 4 === 1 || cycle % 4 === 2 ? 1 : 0.6) : 0.6,
                    transition: 'all 4s ease-in-out' 
                  }} 
                />
              </svg>
            </div>
            <h3 className="text-3xl font-medium text-blue-800 mb-2 h-10 transition-all duration-500">
              {isActive ? boxState : "Ready"}
            </h3>
            <p className="text-blue-600/70 mb-8 h-6">
              {isActive ? `Cycle ${Math.floor(cycle / 4) + 1}` : "Inhale, hold, exhale, hold."}
            </p>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-auto">
          <Button 
            onClick={() => setIsActive(!isActive)}
            className={`rounded-full px-8 py-6 text-lg shadow-md transition-all ${
              tab === 'butterfly' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isActive ? <Square className="w-5 h-5 mr-2" fill="currentColor" /> : <Play className="w-5 h-5 mr-2" fill="currentColor" />}
            {isActive ? "Stop" : "Start Prompts"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
