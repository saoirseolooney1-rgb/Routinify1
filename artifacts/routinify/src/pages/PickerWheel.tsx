import { FC, useState, useRef, useEffect, useCallback } from "react";
import { Dices, Shuffle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
}

const CONFETTI_COLORS = ['#14b8a6', '#0ea5e9', '#f59e0b', '#8b5cf6', '#22c55e', '#ec4899', '#f97316', '#ef4444'];

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 8 + Math.random() * 10,
    delay: Math.random() * 1.2,
    duration: 2.5 + Math.random() * 1.5,
    rotation: Math.random() * 360,
  }));
}

interface CelebrationOverlayProps {
  winner: string;
  onClose: () => void;
}

const CelebrationOverlay: FC<CelebrationOverlayProps> = ({ winner, onClose }) => {
  const [confetti] = useState(() => generateConfetti(80));

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(var(--rot)); opacity: 1; }
          100% { transform: translateY(110vh) rotate(calc(var(--rot) + 540deg)); opacity: 0.6; }
        }
        .confetti-piece {
          position: fixed;
          top: 0;
          animation: confetti-fall var(--dur) var(--delay) linear infinite;
          border-radius: 2px;
          pointer-events: none;
        }
      `}</style>

      {confetti.map(piece => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size * 0.5,
            backgroundColor: piece.color,
            '--rot': `${piece.rotation}deg`,
            '--dur': `${piece.duration}s`,
            '--delay': `${piece.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      <div
        className="relative z-10 bg-white rounded-[2.5rem] p-10 md:p-14 flex flex-col items-center gap-5 shadow-2xl mx-4 max-w-lg w-full text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-6xl select-none">🎉</div>
        <h2 className="text-3xl md:text-4xl font-bold text-teal-900">Congratulations!</h2>
        <div className="px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl md:text-3xl font-bold shadow-lg">
          {winner}
        </div>
        <p className="text-teal-700 text-lg font-medium">has been selected!</p>
        <Button
          onClick={onClose}
          className="mt-2 rounded-2xl px-8 py-5 text-lg bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white shadow-md"
        >
          <X className="w-5 h-5 mr-2" />
          Close
        </Button>
      </div>
    </div>
  );
};

export const PickerWheel: FC = () => {
  const [namesList, setNamesList] = useState("Ava\nNoah\nMila\nEthan\nZara\nLeo");
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);

  const colors = ['#14b8a6', '#0ea5e9', '#f59e0b', '#8b5cf6', '#22c55e', '#ec4899', '#6366f1', '#f97316'];
  const names = namesList.split('\n').map(n => n.trim()).filter(n => n.length > 0);

  const drawWheel = useCallback((rotation: number = 0) => {
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
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(names[i], radius - 28, 8);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }, [names]);

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [namesList, drawWheel]);

  const spin = () => {
    if (isSpinning || names.length === 0) return;
    setIsSpinning(true);
    setWinner(null);

    const spinDuration = 4200;
    const startRotation = rotationRef.current;
    const targetRotation = startRotation + (Math.PI * 2 * 5) + Math.random() * Math.PI * 2;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentRotation = startRotation + (targetRotation - startRotation) * easeProgress;
      rotationRef.current = currentRotation;
      drawWheel(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const arc = (2 * Math.PI) / names.length;
        const normalizedRotation = currentRotation % (2 * Math.PI);
        const pointerAngle = (1.5 * Math.PI - normalizedRotation + 2 * Math.PI) % (2 * Math.PI);
        const winnerIndex = Math.floor(pointerAngle / arc);
        const pickedWinner = names[winnerIndex];
        setWinner(pickedWinner);
        setShowCelebration(true);
      }
    };

    requestAnimationFrame(animate);
  };

  const shuffleList = () => {
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    setNamesList(shuffled.join('\n'));
    setWinner(null);
  };

  return (
    <>
      {showCelebration && winner && (
        <CelebrationOverlay
          winner={winner}
          onClose={() => setShowCelebration(false)}
        />
      )}

      <div className="max-w-6xl mx-auto p-6 animate-in fade-in duration-500">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-pink-900 mb-2">Picker Wheel</h2>
          <p className="text-pink-700">Randomly select students or tasks</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          <div className="md:w-2/3 flex flex-col items-center">
            <div className="relative w-full max-w-[520px] aspect-square flex flex-col items-center justify-center">
              <div className="absolute top-[-10px] z-10 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-purple-600 drop-shadow-md"></div>
              <canvas
                ref={canvasRef}
                width={520}
                height={520}
                className="w-full h-full max-w-[520px] filter drop-shadow-xl rounded-full"
              />
            </div>

            <div className="h-20 mt-6 flex items-center justify-center">
              {winner && !showCelebration && (
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
                  {isSpinning ? "Spinning..." : "Spin Wheel"}
                </Button>
                <Button
                  onClick={shuffleList}
                  disabled={isSpinning || names.length <= 1}
                  variant="outline"
                  className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle List
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </>
  );
};
