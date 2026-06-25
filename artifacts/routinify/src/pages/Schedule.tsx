import { FC, useState } from "react";
import { BookOpen, PenTool, Calculator, FlaskConical, Palette, Sandwich, Activity, Brush } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Schedule: FC = () => {
  const iconBank = [
    { id: 'read', icon: BookOpen, color: 'text-indigo-500' },
    { id: 'write', icon: PenTool, color: 'text-sky-500' },
    { id: 'math', icon: Calculator, color: 'text-red-500' },
    { id: 'science', icon: FlaskConical, color: 'text-emerald-500' },
    { id: 'art', icon: Palette, color: 'text-purple-500' },
    { id: 'lunch', icon: Sandwich, color: 'text-amber-500' },
    { id: 'break', icon: Activity, color: 'text-orange-500' },
    { id: 'clean', icon: Brush, color: 'text-teal-500' }
  ];

  const [schedule, setSchedule] = useState([
    { id: 1, text: "Morning meeting", iconId: 'clean' },
    { id: 2, text: "Reading workshop", iconId: 'read' },
    { id: 3, text: "Numeracy groups", iconId: 'math' },
    { id: 4, text: "Lunch and movement break", iconId: 'lunch' },
    { id: 5, text: "Inquiry project", iconId: 'science' }
  ]);

  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleDrop = (rowId: number) => {
    if (selectedIcon) {
      setSchedule(schedule.map(s => s.id === rowId ? { ...s, iconId: selectedIcon } : s));
      setSelectedIcon(null);
    }
  };

  const handleTextChange = (rowId: number, newText: string) => {
    setSchedule(schedule.map(s => s.id === rowId ? { ...s, text: newText } : s));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500 flex flex-col md:flex-row gap-8">
      
      <div className="md:w-1/3">
        <Card className="p-6 bg-gradient-to-b from-teal-50 to-teal-100/50 border-teal-200 rounded-3xl sticky top-32 shadow-sm">
          <h3 className="font-bold text-teal-900 mb-4 text-center">Icon Bank</h3>
          <p className="text-sm text-teal-700 text-center mb-6">Select an icon, then click a slot to assign it.</p>
          
          <div className="grid grid-cols-4 gap-3">
            {iconBank.map(item => {
              const Icon = item.icon;
              const isSelected = selectedIcon === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedIcon(isSelected ? null : item.id)}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-all bg-white border-2 shadow-sm ${
                    isSelected ? 'border-teal-500 ring-2 ring-teal-200 ring-offset-1 scale-110 z-10' : 'border-transparent hover:border-teal-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 ${item.color}`} />
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="md:w-2/3">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-teal-900 mb-2">Visual Schedule</h2>
          <p className="text-teal-700">Set the flow for today</p>
        </div>

        <div className="space-y-4">
          {schedule.map((slot, index) => {
            const assignedIcon = iconBank.find(i => i.id === slot.iconId);
            const IconComp = assignedIcon?.icon;
            return (
              <div key={slot.id} className="flex items-center gap-4 group">
                <button 
                  onClick={() => handleDrop(slot.id)}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all ${
                    selectedIcon ? 'border-dashed border-teal-400 bg-teal-50 hover:bg-teal-100 cursor-pointer animate-pulse' 
                    : 'border-transparent bg-white shadow-sm'
                  }`}
                >
                  {IconComp && <IconComp className={`w-8 h-8 ${assignedIcon.color}`} />}
                </button>
                <div className="flex-1">
                  <Input 
                    value={slot.text}
                    onChange={(e) => handleTextChange(slot.id, e.target.value)}
                    className="h-16 text-lg font-medium bg-white border-none shadow-sm rounded-2xl focus-visible:ring-teal-400 px-6 text-teal-950 placeholder:text-teal-300"
                    placeholder={`Activity ${index + 1}...`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
