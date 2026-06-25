import { FC, useState } from "react";
import { Card } from "@/components/ui/card";
import { BatteryLow, CheckCircle2, Zap, AlertTriangle } from "lucide-react";

export const Zones: FC = () => {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const zones = [
    { 
      id: 'blue', 
      name: 'Blue Zone', 
      desc: 'Low energy, tired, sad, or unwell', 
      icon: BatteryLow, 
      bg: 'bg-blue-50', 
      border: 'border-blue-200', 
      text: 'text-blue-800',
      gradient: 'from-blue-500 to-sky-400',
      strategies: [
        'Drink water and stretch',
        'Take movement breaks',
        'Use bright clear instructions',
        'Check in quietly one-to-one'
      ]
    },
    { 
      id: 'green', 
      name: 'Green Zone', 
      desc: 'Calm, focused, ready to learn', 
      icon: CheckCircle2, 
      bg: 'bg-green-50', 
      border: 'border-green-200', 
      text: 'text-green-800',
      gradient: 'from-green-500 to-emerald-400',
      strategies: [
        'Start new learning tasks',
        'Celebrate productive choices',
        'Set goals for the next block',
        'Offer peer leadership roles'
      ]
    },
    { 
      id: 'yellow', 
      name: 'Yellow Zone', 
      desc: 'Wiggly, worried, excited, frustrated', 
      icon: Zap, 
      bg: 'bg-yellow-50', 
      border: 'border-yellow-200', 
      text: 'text-yellow-800',
      gradient: 'from-yellow-400 to-amber-500',
      strategies: [
        'Use breathing or counting',
        'Offer a short sensory break',
        'Reduce language load',
        'Name the feeling without judgment'
      ]
    },
    { 
      id: 'red', 
      name: 'Red Zone', 
      desc: 'Overwhelmed, unsafe, out of control', 
      icon: AlertTriangle, 
      bg: 'bg-red-50', 
      border: 'border-red-200', 
      text: 'text-red-800',
      gradient: 'from-red-500 to-rose-500',
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
        <p className="text-teal-700">Check in and find strategies</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {zones.map((zone) => {
          const Icon = zone.icon;
          const isActive = activeZone === zone.id;
          return (
            <Card 
              key={zone.id}
              onClick={() => setActiveZone(isActive ? null : zone.id)}
              className={`p-6 cursor-pointer transition-all duration-300 border-2 overflow-hidden relative group ${
                isActive ? `ring-2 ring-offset-2 ring-opacity-50 ring-${zone.id}-500 ${zone.border}` : `hover:shadow-md ${zone.border}`
              }`}
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${zone.gradient} group-hover:opacity-20 transition-opacity`} />
              <div className="relative z-10 flex items-center gap-4">
                <div className={`p-4 rounded-2xl bg-white shadow-sm`}>
                  <Icon className={`w-8 h-8 ${zone.text}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${zone.text} mb-1`}>{zone.name}</h3>
                  <p className={`${zone.text} opacity-80 text-sm font-medium`}>{zone.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedData && (
        <Card className={`p-8 animate-in slide-in-from-bottom-4 rounded-[2rem] border-2 ${selectedData.border} ${selectedData.bg} shadow-lg`}>
          <div className="flex items-center gap-4 mb-8 border-b border-black/5 pb-6">
            <div className={`p-4 rounded-2xl bg-white shadow-sm inline-block`}>
              <selectedData.icon className={`w-10 h-10 ${selectedData.text}`} />
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${selectedData.text}`}>{selectedData.name} Strategies</h3>
              <p className={`${selectedData.text} opacity-80 font-medium`}>When students are feeling {selectedData.desc.toLowerCase()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedData.strategies.map((strategy, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-black/5 flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${selectedData.gradient} text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5`}>
                  {idx + 1}
                </div>
                <span className={`font-medium ${selectedData.text}`}>{strategy}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
