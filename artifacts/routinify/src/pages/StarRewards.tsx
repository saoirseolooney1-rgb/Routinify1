import { FC, useState, useEffect } from "react";
import { Star, RotateCcw, Plus, Minus, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CelebrationBanner } from "@/components/CelebrationBanner";

export const StarRewards: FC = () => {
  const [starCount, setStarCount] = useState<number>(() => {
    const saved = localStorage.getItem('routinify-star-count');
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [reward, setReward] = useState(() => localStorage.getItem('routinify-star-reward') || "10 minutes extra recess");
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    localStorage.setItem('routinify-star-count', String(starCount));
  }, [starCount]);

  useEffect(() => {
    localStorage.setItem('routinify-star-reward', reward);
  }, [reward]);

  const handleAdd = () => {
    if (starCount < 10) {
      const newCount = starCount + 1;
      setStarCount(newCount);
      if (newCount === 10) {
        setShowCelebration(true);
      }
    }
  };

  const handleRemove = () => {
    if (starCount > 0) {
      setStarCount(starCount - 1);
    }
  };

  const handleReset = () => {
    setStarCount(0);
  };

  const handleCelebrate = () => {
    setShowCelebration(true);
  };

  // Fixed positions for up to 10 stars inside the jar
  const starPositions = [
    { x: 120, y: 320, r: -15 },
    { x: 170, y: 310, r: 10 },
    { x: 220, y: 330, r: -5 },
    { x: 140, y: 270, r: 20 },
    { x: 200, y: 260, r: -25 },
    { x: 170, y: 220, r: 5 },
    { x: 120, y: 210, r: -10 },
    { x: 220, y: 210, r: 15 },
    { x: 150, y: 160, r: -20 },
    { x: 200, y: 150, r: 30 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col items-center animate-in fade-in duration-500">
      <CelebrationBanner 
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        title="Goal Reached!"
        message={`Reward: ${reward}`}
      />

      <div className="text-center mb-10 w-full">
        <h2 className="text-3xl font-bold text-yellow-900 mb-2">Star Rewards</h2>
        <p className="text-yellow-700">Track class goals together</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-4 w-full max-w-lg mb-8 shadow-sm">
        <label className="text-sm font-bold text-yellow-800 uppercase tracking-wider mb-2 block px-2">Class Reward Target</label>
        <Input 
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          className="text-xl font-semibold bg-white border-yellow-200 shadow-sm rounded-2xl focus-visible:ring-yellow-400 text-yellow-900 placeholder:text-yellow-300"
          placeholder="What are we working towards?"
        />
      </div>

      <Card className="p-8 bg-white rounded-[3rem] shadow-sm border-yellow-100 flex flex-col items-center w-full max-w-lg">
        
        <div className="relative w-80 h-96 mb-8 flex justify-center">
          <svg viewBox="0 0 340 400" className="w-full h-full drop-shadow-md">
            {/* Jar Background/Glass back */}
            <path 
              d="M 120,40 L 220,40 C 230,40 235,50 235,60 L 235,80 C 235,90 245,100 255,110 C 275,130 280,160 280,200 L 280,340 C 280,370 250,380 170,380 C 90,380 60,370 60,340 L 60,200 C 60,160 65,130 85,110 C 95,100 105,90 105,80 L 105,60 C 105,50 110,40 120,40 Z" 
              fill="#f8fafc" stroke="#cbd5e1" strokeWidth="6" strokeLinejoin="round" 
            />
            
            {/* Stars */}
            {starPositions.slice(0, starCount).map((pos, idx) => (
              <g key={idx} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.r}) scale(0.8)`} className="animate-in zoom-in duration-300">
                <path 
                  d="M0,-24 L7,-7 L24,-7 L10,3 L15,20 L0,10 L-15,20 L-10,3 L-24,-7 L-7,-7 Z" 
                  fill={idx % 2 === 0 ? "#fbbf24" : "#f59e0b"} 
                  stroke="#b45309" strokeWidth="2" strokeLinejoin="round"
                />
              </g>
            ))}

            {/* Jar Foreground/Glass front reflection */}
            <path 
              d="M 120,40 L 220,40 C 230,40 235,50 235,60 L 235,80 C 235,90 245,100 255,110 C 275,130 280,160 280,200 L 280,340 C 280,370 250,380 170,380 C 90,380 60,370 60,340 L 60,200 C 60,160 65,130 85,110 C 95,100 105,90 105,80 L 105,60 C 105,50 110,40 120,40 Z" 
              fill="url(#glass-shine)" opacity="0.3" pointerEvents="none"
            />
            <path 
              d="M 105,80 L 235,80" 
              stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" opacity="0.5"
            />
            <defs>
              <linearGradient id="glass-shine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="15%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="text-4xl font-bold text-yellow-900 mb-2 font-mono">
          {starCount} <span className="text-2xl text-yellow-600 font-sans">/ 10</span>
        </div>
        <p className="text-yellow-700 font-medium mb-8">stars collected</p>

        <div className="grid grid-cols-2 gap-4 w-full">
          <Button 
            onClick={handleAdd} 
            disabled={starCount >= 10}
            className="rounded-2xl py-6 text-lg bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white shadow-sm transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Star
          </Button>
          <Button 
            onClick={handleRemove}
            disabled={starCount <= 0}
            variant="outline"
            className="rounded-2xl py-6 text-lg border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <Minus className="w-5 h-5 mr-2" />
            Remove
          </Button>
          <Button 
            onClick={handleCelebrate}
            className="rounded-2xl py-6 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-sm transition-all"
          >
            <PartyPopper className="w-5 h-5 mr-2" />
            Celebrate
          </Button>
          <Button 
            onClick={handleReset}
            variant="outline"
            className="rounded-2xl py-6 text-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>
      </Card>
    </div>
  );
};
