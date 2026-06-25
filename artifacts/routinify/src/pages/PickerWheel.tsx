import { FC, useState, useRef, useEffect } from "react";
import { Dices, RefreshCw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const PickerWheel: FC = () => {
  const [namesList, setNamesList] = useState("Ava\nNoah\nMila\nEthan\nZara\nLeo");
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);

  const colors = ['#14b8a6', '#0ea5e9', '#f59e0b', '#8b5cf6', '#22c55e', '#ec4899', '#6366f1', '#f97316'];
  const names = namesList.split('\n').map(n => n.trim()).filter(n => n.length > 0);

  const drawWheel = (rotation: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) - 10;

    ctx.clearRect(0, 0, width, height);

    if (names.length === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#f1f5f9';
      ctx.fill();
      ctx.stroke();
      return;
    }

    const arc = (2 * Math.PI) / names.length;

    for (let i = 0; i < names.length; i++) {
      const angle = rotation + i * arc;
      
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + arc);
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(names[i], radius - 30, 8);
      ctx.restore();
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  };

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [namesList]);

  const spin = () => {
    if (isSpinning || names.length === 0) return;
    
    setIsSpinning(true);
    setWinner(null);
    
    const spinDuration = 4200;
    const startRotation = rotationRef.current;
    const targetRotation = startRotation + (Math.PI * 2 * 5) + Math.random() * Math.PI * 2; // 5 full spins + random

    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      const currentRotation = startRotation + (targetRotation - startRotation) * easeProgress;
      rotationRef.current = currentRotation;
      
      drawWheel(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        
        // Calculate winner
        const arc = (2 * Math.PI) / names.length;
        // The pointer is at top (1.5 PI or 270 deg)
        // Find which segment is under the pointer
        const normalizedRotation = currentRotation % (2 * Math.PI);
        const pointerAngle = (1.5 * Math.PI - normalizedRotation + 2 * Math.PI) % (2 * Math.PI);
        const winnerIndex = Math.floor(pointerAngle / arc);
        setWinner(names[winnerIndex]);
      }
    };

    requestAnimationFrame(animate);
  };

  const shuffleList = () => {
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    setNamesList(shuffled.join('\n'));
    setWinner(null);
  };

  const refreshWheel = () => {
    drawWheel(rotationRef.current);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-pink-900 mb-2">Picker Wheel</h2>
        <p className="text-pink-700">Randomly select students or tasks</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        <div className="md:w-2/3 flex flex-col items-center">
          <div className="relative w-full max-w-[520px] aspect-square flex flex-col items-center justify-center">
            {/* Pointer */}
            <div className="absolute top-[-10px] z-10 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-purple-600 drop-shadow-md"></div>
            
            <canvas 
              ref={canvasRef} 
              width={520} 
              height={520} 
              className="w-full h-full max-w-[520px] filter drop-shadow-xl rounded-full"
            />
          </div>

          <div className="h-20 mt-6 flex items-center justify-center">
            {winner && (
              <div className="animate-in slide-in-from-bottom-4 fade-in px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-2xl font-bold shadow-lg">
                Winner: {winner}
              </div>
            )}
          </div>
        </div>

        <div className="md:w-1/3">
          <Card className="p-6 bg-pink-50/50 border-pink-100 rounded-3xl shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-pink-900">Entries</h3>
              <span className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-sm font-bold">{names.length}</span>
            </div>
            
            <Textarea 
              value={namesList}
              onChange={(e) => {
                setNamesList(e.target.value);
                setWinner(null);
              }}
              className="flex-1 min-h-[200px] resize-none rounded-2xl bg-white border-pink-200 focus-visible:ring-pink-400 text-lg p-4 font-medium text-pink-950 mb-6 shadow-inner"
              placeholder="Enter names, one per line..."
            />

            <div className="flex flex-col gap-3">
              <Button 
                onClick={spin}
                disabled={isSpinning || names.length === 0}
                className="w-full rounded-2xl py-6 text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md transition-all"
              >
                <Dices className="w-6 h-6 mr-2" />
                Spin Wheel
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={shuffleList}
                  disabled={isSpinning || names.length <= 1}
                  variant="outline"
                  className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle
                </Button>
                <Button 
                  onClick={refreshWheel}
                  disabled={isSpinning}
                  variant="outline"
                  className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 bg-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};
