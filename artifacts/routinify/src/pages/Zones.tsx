import { FC, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Smile, Meh, Zap, StopCircle } from "lucide-react";

export const Zones: FC = () => {
  const [activeZone, setActiveZone] = useState<string | null>(() => {
    return localStorage.getItem('routinify-zone') || null;
  });

  useEffect(() => {
    if (activeZone) {
      localStorage.setItem('routinify-zone', activeZone);
    } else {
      localStorage.removeItem('routinify-zone');
    }
  }, [activeZone]);

  const zones = [
    {
      id: 'green',
      name: 'Ready to Learn',
      emoji: '😊',
      icon: Smile,
      childLabel: 'I feel calm and focused!',
      bg: 'bg-green-500',
      bgLight: 'bg-green-50',
      border: 'border-green-300',
      text: 'text-green-800',
      ringColor: 'ring-green-400',
      strategies: [
        'Start new learning tasks',
        'Celebrate productive choices',
        'Set goals for the next block',
        'Offer peer leadership roles'
      ]
    },
    {
      id: 'blue',
      name: 'Feeling Slow',
      emoji: '😔',
      icon: Meh,
      childLabel: 'I feel tired or sad.',
      bg: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-800',
      ringColor: 'ring-blue-400',
      strategies: [
        'Drink water and stretch',
        'Take movement breaks',
        'Use bright clear instructions',
        'Check in quietly one-to-one'
      ]
    },
    {
      id: 'yellow',
      name: 'Losing Focus',
      emoji: '😬',
      icon: Zap,
      childLabel: 'I feel wiggly or worried.',
      bg: 'bg-yellow-400',
      bgLight: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-800',
      ringColor: 'ring-yellow-400',
      strategies: [
        'Try breathing or counting',
        'Offer a short sensory break',
        'Reduce language load',
        'Name the feeling without judgment'
      ]
    },
    {
      id: 'red',
      name: 'Not Ready',
      emoji: '😡',
      icon: StopCircle,
      childLabel: 'I feel overwhelmed or upset.',
      bg: 'bg-red-500',
      bgLight: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-800',
      ringColor: 'ring-red-400',
      strategies: [
        'Lower demands immediately',
        'Move to a safe calm space',
        'Use short predictable scripts',
        'Reconnect after regulation'
      ]
    }
  ];

  const selectedData = zones.find(z => z.id === activeZone);

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-teal-900 mb-2">Zones of Regulation</h2>
        <p className="text-teal-700 text-lg">How are you feeling right now?</p>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-10">
        {zones.map((zone) => {
          const Icon = zone.icon;
          const isActive = activeZone === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => setActiveZone(isActive ? null : zone.id)}
              className={`rounded-3xl p-6 md:p-8 flex flex-col items-center gap-4 transition-all duration-200 border-2 shadow-sm active:scale-95 ${
                isActive
                  ? `${zone.bgLight} ${zone.border} ring-4 ${zone.ringColor} ring-offset-2 scale-[1.03] shadow-lg`
                  : `bg-white ${zone.border} hover:shadow-md hover:scale-[1.02]`
              }`}
            >
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${zone.bg} flex items-center justify-center shadow-md`}>
                <span className="text-5xl md:text-6xl leading-none select-none">{zone.emoji}</span>
              </div>
              <div className="text-center">
                <p className={`text-xl md:text-2xl font-bold ${zone.text} mb-1`}>{zone.name}</p>
                <p className={`text-sm md:text-base font-medium ${zone.text} opacity-70`}>{zone.childLabel}</p>
              </div>
            </button>
          );
        })}
      </div>

      {selectedData && (
        <Card className={`p-8 animate-in slide-in-from-bottom-4 rounded-[2rem] border-2 ${selectedData.border} ${selectedData.bgLight} shadow-lg`}>
          <div className="flex items-center gap-4 mb-8 border-b border-black/5 pb-6">
            <div className={`w-14 h-14 rounded-full ${selectedData.bg} flex items-center justify-center shadow-sm shrink-0`}>
              <span className="text-3xl">{selectedData.emoji}</span>
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${selectedData.text}`}>{selectedData.name} — Strategies</h3>
              <p className={`${selectedData.text} opacity-70 font-medium`}>{selectedData.childLabel}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedData.strategies.map((strategy, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-black/5 flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full ${selectedData.bg} text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5`}>
                  {idx + 1}
                </div>
                <span className={`font-medium ${selectedData.text} text-base`}>{strategy}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
