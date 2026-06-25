import { FC, useState, useEffect } from "react";
import { Settings, Timer, Wind, Layout, ListTodo, Columns, Star, Dices, X, Smile, Meh, Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const Dashboard: FC<DashboardProps> = ({ onNavigate }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [layout, setLayout] = useState({
    snapshot: true,
    notes: true,
    wellbeing: true,
    tools: true
  });
  
  const [notes, setNotes] = useState(() => localStorage.getItem("routinify_notes") || "");
  const [climateStatus, setClimateStatus] = useState("Ready for learning");

  useEffect(() => {
    localStorage.setItem("routinify_notes", notes);
  }, [notes]);

  const tools = [
    { id: 'timer', label: 'Focus Timer', desc: 'Customizable countdowns', icon: Timer, color: 'text-sky-500', bg: 'bg-sky-100' },
    { id: 'breathing', label: 'Breathing Room', desc: 'Guided regulation', icon: Wind, color: 'text-teal-500', bg: 'bg-teal-100' },
    { id: 'zones', label: 'Zones', desc: 'Check in & strategies', icon: Layout, color: 'text-indigo-500', bg: 'bg-indigo-100' },
    { id: 'schedule', label: 'Visual Schedule', desc: 'Daily flow', icon: ListTodo, color: 'text-amber-500', bg: 'bg-amber-100' },
    { id: 'nownext', label: 'Now & Next', desc: 'Task breakdown', icon: Columns, color: 'text-purple-500', bg: 'bg-purple-100' },
    { id: 'rewards', label: 'Star Rewards', desc: 'Class goals', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { id: 'wheel', label: 'Picker Wheel', desc: 'Random selection', icon: Dices, color: 'text-pink-500', bg: 'bg-pink-100' },
  ];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-teal-900">Good morning!</h2>
        <Button 
          onClick={() => setShowSettings(!showSettings)}
          variant="outline"
          className="bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 rounded-full"
        >
          <Settings className="w-4 h-4 mr-2" />
          Customize Layout
        </Button>
      </div>

      {showSettings && (
        <Card className="p-6 mb-8 bg-indigo-50/50 border-indigo-100 shadow-sm rounded-2xl animate-in slide-in-from-top-4">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-semibold text-indigo-900">Dashboard Layout</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)} className="text-indigo-500 hover:bg-indigo-100 rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <Switch checked={layout.snapshot} onCheckedChange={(c) => setLayout({...layout, snapshot: c})} />
              <span className="text-indigo-800">Snapshot widget</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <Switch checked={layout.notes} onCheckedChange={(c) => setLayout({...layout, notes: c})} />
              <span className="text-indigo-800">Quick notes</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <Switch checked={layout.wellbeing} onCheckedChange={(c) => setLayout({...layout, wellbeing: c})} />
              <span className="text-indigo-800">Class climate</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <Switch checked={layout.tools} onCheckedChange={(c) => setLayout({...layout, tools: c})} />
              <span className="text-indigo-800">Tools grid</span>
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setShowSettings(false)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
              Done
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {layout.snapshot && (
          <Card className="p-6 bg-white rounded-3xl shadow-sm border-teal-100 hover-elevate">
            <h3 className="text-sm font-medium text-teal-600 uppercase tracking-wider mb-4">Today</h3>
            <div className="text-3xl font-bold text-teal-950">{today}</div>
          </Card>
        )}
        
        {layout.notes && (
          <Card className="p-6 bg-white rounded-3xl shadow-sm border-teal-100 hover-elevate">
            <h3 className="text-sm font-medium text-teal-600 uppercase tracking-wider mb-4">Quick Notes</h3>
            <textarea 
              className="w-full h-24 resize-none outline-none text-teal-900 placeholder:text-teal-300 bg-transparent"
              placeholder="Jot down notes for later..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Card>
        )}

        {layout.wellbeing && (
          <Card className="p-6 bg-white rounded-3xl shadow-sm border-teal-100 hover-elevate">
            <h3 className="text-sm font-medium text-teal-600 uppercase tracking-wider mb-4">Class Climate</h3>
            <div className="font-medium text-teal-900 mb-4">{climateStatus}</div>
            <div className="flex gap-2">
              <Button onClick={() => setClimateStatus("Calm and ready")} variant="outline" className="flex-1 rounded-xl hover:bg-green-50 border-green-200">
                <Smile className="w-5 h-5 text-green-500" />
              </Button>
              <Button onClick={() => setClimateStatus("Steady but distracted")} variant="outline" className="flex-1 rounded-xl hover:bg-yellow-50 border-yellow-200">
                <Meh className="w-5 h-5 text-yellow-500" />
              </Button>
              <Button onClick={() => setClimateStatus("Needs regulation support")} variant="outline" className="flex-1 rounded-xl hover:bg-red-50 border-red-200">
                <Frown className="w-5 h-5 text-red-500" />
              </Button>
            </div>
          </Card>
        )}
      </div>

      {layout.tools && (
        <>
          <h3 className="text-xl font-semibold text-teal-900 mb-6">Classroom Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card 
                  key={tool.id} 
                  className="p-6 bg-white rounded-3xl shadow-sm border-teal-100 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group"
                  onClick={() => onNavigate(tool.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-2xl ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-teal-950 mb-1">{tool.label}</h4>
                      <p className="text-teal-600/70 text-sm">{tool.desc}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
