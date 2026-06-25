import { FC, useState, useEffect } from "react";
import { BookOpen, PenTool, Calculator, FlaskConical, Palette, Sandwich, Activity, ChefHat, Coffee, Music } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ScheduleSlot {
  id: number;
  time: string;
  text: string;
  iconId: string;
}

const DEFAULT_SCHEDULE: ScheduleSlot[] = [
  { id: 1, time: "9:00 AM", text: "Maths", iconId: 'math' },
  { id: 2, time: "9:45 AM", text: "Writing", iconId: 'write' },
  { id: 3, time: "10:30 AM", text: "Reading", iconId: 'read' },
  { id: 4, time: "11:15 AM", text: "Cooking", iconId: 'cook' },
  { id: 5, time: "12:00 PM", text: "Snack Time", iconId: 'lunch' },
  { id: 6, time: "12:30 PM", text: "Recess", iconId: 'break' },
];

export const Schedule: FC = () => {
  const iconBank = [
    { id: 'read', icon: BookOpen, color: 'text-indigo-500', label: 'Reading' },
    { id: 'write', icon: PenTool, color: 'text-sky-500', label: 'Writing' },
    { id: 'math', icon: Calculator, color: 'text-red-500', label: 'Maths' },
    { id: 'science', icon: FlaskConical, color: 'text-emerald-500', label: 'Science' },
    { id: 'art', icon: Palette, color: 'text-purple-500', label: 'Art' },
    { id: 'lunch', icon: Sandwich, color: 'text-amber-500', label: 'Snack' },
    { id: 'break', icon: Activity, color: 'text-orange-500', label: 'Recess' },
    { id: 'cook', icon: ChefHat, color: 'text-teal-500', label: 'Cooking' },
    { id: 'music', icon: Music, color: 'text-pink-500', label: 'Music' },
    { id: 'coffee', icon: Coffee, color: 'text-brown-500', label: 'Break' },
  ];

  const [schedule, setSchedule] = useState<ScheduleSlot[]>(() => {
    try {
      const saved = localStorage.getItem('routinify-schedule');
      return saved ? JSON.parse(saved) : DEFAULT_SCHEDULE;
    } catch {
      return DEFAULT_SCHEDULE;
    }
  });

  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('routinify-schedule', JSON.stringify(schedule));
  }, [schedule]);

  const handleIconClick = (rowId: number) => {
    if (selectedIcon) {
      setSchedule(schedule.map(s => s.id === rowId ? { ...s, iconId: selectedIcon } : s));
      setSelectedIcon(null);
    }
  };

  const handleTextChange = (rowId: number, newText: string) => {
    setSchedule(schedule.map(s => s.id === rowId ? { ...s, text: newText } : s));
  };

  const handleTimeChange = (rowId: number, newTime: string) => {
    setSchedule(schedule.map(s => s.id === rowId ? { ...s, time: newTime } : s));
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
                  title={item.label}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-all bg-white border-2 shadow-sm ${
                    isSelected ? 'border-teal-500 ring-2 ring-teal-200 ring-offset-1 scale-110 z-10' : 'border-transparent hover:border-teal-300'
                  }`}
                >
                  <Icon className={`w-7 h-7 ${item.color}`} />
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

        <div className="space-y-3">
          {schedule.map((slot, index) => {
            const assignedIcon = iconBank.find(i => i.id === slot.iconId);
            const IconComp = assignedIcon?.icon;
            return (
              <div key={slot.id} className="flex items-center gap-3 group">
                <input
                  type="text"
                  value={slot.time}
                  onChange={(e) => handleTimeChange(slot.id, e.target.value)}
                  placeholder="9:00 AM"
                  className="w-24 shrink-0 h-14 text-center text-sm font-bold text-teal-800 bg-white border border-teal-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-300 px-2 shadow-sm"
                />
                <button
                  onClick={() => handleIconClick(slot.id)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all ${
                    selectedIcon
                      ? 'border-dashed border-teal-400 bg-teal-50 hover:bg-teal-100 cursor-pointer animate-pulse'
                      : 'border-transparent bg-white shadow-sm hover:border-teal-200'
                  }`}
                >
                  {IconComp && <IconComp className={`w-7 h-7 ${assignedIcon.color}`} />}
                </button>
                <div className="flex-1">
                  <Input
                    value={slot.text}
                    onChange={(e) => handleTextChange(slot.id, e.target.value)}
                    className="h-14 text-lg font-medium bg-white border-none shadow-sm rounded-2xl focus-visible:ring-teal-400 px-6 text-teal-950 placeholder:text-teal-300"
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
