import { FC, useState, useEffect } from "react";
import { BookOpen, PenTool, Calculator, FlaskConical, Palette, Sandwich, Activity, ChefHat, Coffee, Music, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    { id: 'coffee', icon: Coffee, color: 'text-yellow-700', label: 'Break' },
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
      setSchedule(s => s.map(slot => slot.id === rowId ? { ...slot, iconId: selectedIcon } : slot));
      setSelectedIcon(null);
    }
  };

  const handleTextChange = (rowId: number, newText: string) => {
    setSchedule(s => s.map(slot => slot.id === rowId ? { ...slot, text: newText } : slot));
  };

  const handleTimeChange = (rowId: number, newTime: string) => {
    setSchedule(s => s.map(slot => slot.id === rowId ? { ...slot, time: newTime } : slot));
  };

  const addRow = () => {
    const newId = Date.now();
    setSchedule(s => [...s, { id: newId, time: "", text: "", iconId: 'read' }]);
  };

  const removeRow = (rowId: number) => {
    setSchedule(s => s.filter(slot => slot.id !== rowId));
  };

  const resetToDefault = () => {
    setSchedule(DEFAULT_SCHEDULE);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500 flex flex-col md:flex-row gap-8">

      <div className="md:w-1/3">
        <Card className="p-6 bg-gradient-to-b from-teal-50 to-teal-100/50 border-teal-200 rounded-3xl sticky top-32 shadow-sm">
          <h3 className="font-bold text-teal-900 mb-4 text-center">Icon Bank</h3>
          <p className="text-sm text-teal-700 text-center mb-6">Select an icon, then click a slot to assign it.</p>

          <div className="grid grid-cols-4 gap-3 mb-6">
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

          <div className="border-t border-teal-200 pt-5 flex flex-col gap-2">
            <Button
              onClick={addRow}
              className="w-full rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
            <Button
              onClick={resetToDefault}
              variant="outline"
              className="w-full rounded-2xl border-teal-200 text-teal-700 hover:bg-teal-50 text-sm"
            >
              Reset to Default
            </Button>
          </div>
        </Card>
      </div>

      <div className="md:w-2/3">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-teal-900 mb-2">Visual Schedule</h2>
          <p className="text-teal-700">Set the flow for today — {schedule.length} {schedule.length === 1 ? 'activity' : 'activities'}</p>
        </div>

        {schedule.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-teal-400" />
            </div>
            <p className="text-teal-700 font-medium text-lg mb-1">No activities yet</p>
            <p className="text-teal-500 text-sm">Click "Add Activity" to build the schedule.</p>
          </div>
        ) : (
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
                  <button
                    onClick={() => removeRow(slot.id)}
                    title="Remove this activity"
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-red-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5">
          <Button
            onClick={addRow}
            variant="outline"
            className="w-full rounded-2xl h-14 border-dashed border-2 border-teal-300 text-teal-600 hover:bg-teal-50 hover:border-teal-400 font-semibold text-base"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Activity
          </Button>
        </div>
      </div>

    </div>
  );
};
