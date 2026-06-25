import { FC, useState } from "react";
import { BookOpen, PenTool, Calculator, Palette, Activity, Sandwich } from "lucide-react";
import { Card } from "@/components/ui/card";

export const NowNext: FC = () => {
  const iconBank = [
    { id: 'read', icon: BookOpen, color: 'text-indigo-500' },
    { id: 'write', icon: PenTool, color: 'text-sky-500' },
    { id: 'math', icon: Calculator, color: 'text-red-500' },
    { id: 'art', icon: Palette, color: 'text-purple-500' },
    { id: 'break', icon: Activity, color: 'text-orange-500' },
    { id: 'lunch', icon: Sandwich, color: 'text-amber-500' },
  ];

  const [nowSlot, setNowSlot] = useState({ iconId: 'read', text: 'Independent reading' });
  const [nextSlot, setNextSlot] = useState({ iconId: 'math', text: 'Math stations' });
  
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleDropNow = () => {
    if (selectedIcon) {
      setNowSlot({ ...nowSlot, iconId: selectedIcon });
      setSelectedIcon(null);
    }
  };

  const handleDropNext = () => {
    if (selectedIcon) {
      setNextSlot({ ...nextSlot, iconId: selectedIcon });
      setSelectedIcon(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-teal-900 mb-2">Now & Next</h2>
        <p className="text-teal-700">Clear transitions, lower anxiety</p>
      </div>

      <div className="flex justify-center mb-10">
        <Card className="p-4 bg-indigo-50 border-indigo-100 rounded-[2rem] shadow-sm inline-flex gap-3">
          {iconBank.map(item => {
            const Icon = item.icon;
            const isSelected = selectedIcon === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedIcon(isSelected ? null : item.id)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all bg-white border-2 shadow-sm ${
                  isSelected ? 'border-indigo-500 ring-2 ring-indigo-200 ring-offset-1 scale-110 z-10' : 'border-transparent hover:border-indigo-200'
                }`}
              >
                <Icon className={`w-8 h-8 ${item.color}`} />
              </button>
            );
          })}
        </Card>
      </div>

      <Card className="p-8 md:p-12 bg-gray-50 border-gray-200 rounded-[3rem] shadow-inner max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
          {/* Divider line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2 rounded-full"></div>

          {/* NOW Column */}
          <div className="flex flex-col items-center">
            <div className="bg-teal-500 text-white px-8 py-2 rounded-full text-xl font-bold uppercase tracking-widest mb-8 shadow-sm">Now</div>
            <button 
              onClick={handleDropNow}
              className={`w-40 h-40 rounded-[2.5rem] bg-white flex items-center justify-center mb-6 transition-all border-4 shadow-sm ${
                selectedIcon ? 'border-dashed border-teal-400 hover:bg-teal-50 cursor-pointer animate-pulse' : 'border-transparent'
              }`}
            >
              {nowSlot.iconId && iconBank.find(i => i.id === nowSlot.iconId) && (
                <div className="scale-[2]">
                  {(() => {
                    const found = iconBank.find(i => i.id === nowSlot.iconId);
                    const Comp = found!.icon;
                    return <Comp className={`w-8 h-8 ${found!.color}`} />;
                  })()}
                </div>
              )}
            </button>
            <input 
              value={nowSlot.text}
              onChange={(e) => setNowSlot({ ...nowSlot, text: e.target.value })}
              className="text-2xl md:text-3xl font-bold text-center text-teal-950 bg-transparent border-b-2 border-transparent hover:border-teal-200 focus:border-teal-400 outline-none transition-colors w-full"
              placeholder="What are we doing?"
            />
          </div>

          {/* NEXT Column */}
          <div className="flex flex-col items-center">
            <div className="bg-indigo-500 text-white px-8 py-2 rounded-full text-xl font-bold uppercase tracking-widest mb-8 shadow-sm">Next</div>
            <button 
              onClick={handleDropNext}
              className={`w-40 h-40 rounded-[2.5rem] bg-white flex items-center justify-center mb-6 transition-all border-4 shadow-sm ${
                selectedIcon ? 'border-dashed border-indigo-400 hover:bg-indigo-50 cursor-pointer animate-pulse' : 'border-transparent'
              }`}
            >
              {nextSlot.iconId && iconBank.find(i => i.id === nextSlot.iconId) && (
                <div className="scale-[2]">
                  {(() => {
                    const found = iconBank.find(i => i.id === nextSlot.iconId);
                    const Comp = found!.icon;
                    return <Comp className={`w-8 h-8 ${found!.color}`} />;
                  })()}
                </div>
              )}
            </button>
            <input 
              value={nextSlot.text}
              onChange={(e) => setNextSlot({ ...nextSlot, text: e.target.value })}
              className="text-2xl md:text-3xl font-bold text-center text-indigo-950 bg-transparent border-b-2 border-transparent hover:border-indigo-200 focus:border-indigo-400 outline-none transition-colors w-full"
              placeholder="What's coming up?"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
