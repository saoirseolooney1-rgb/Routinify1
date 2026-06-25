import { FC } from "react";
import { LayoutDashboard, Timer, Wind, Layout, ListTodo, Columns, Star, Dices } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SiteNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const SiteNav: FC<SiteNavProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timer', label: 'Focus Timer', icon: Timer },
    { id: 'breathing', label: 'Breathing Room', icon: Wind },
    { id: 'zones', label: 'Zones of Regulation', icon: Layout },
    { id: 'schedule', label: 'Visual Schedule', icon: ListTodo },
    { id: 'nownext', label: 'Now & Next', icon: Columns },
    { id: 'rewards', label: 'Star Rewards', icon: Star },
    { id: 'wheel', label: 'Picker Wheel', icon: Dices },
  ];

  return (
    <nav className="w-full bg-white/70 backdrop-blur-md border-b border-teal-100/50 sticky top-[114px] z-30 overflow-x-auto no-scrollbar shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center p-2 gap-2 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={`rounded-full px-4 py-2 h-auto flex items-center gap-2 transition-all ${
                isActive 
                  ? "bg-teal-100 text-teal-800 hover:bg-teal-200 shadow-sm" 
                  : "text-teal-700/70 hover:text-teal-900 hover:bg-teal-50"
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};
