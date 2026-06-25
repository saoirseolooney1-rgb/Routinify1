import { useState } from "react";
import { HelpCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteNav } from "@/components/SiteNav";
import { Dashboard } from "@/pages/Dashboard";
import { FocusTimer } from "@/pages/FocusTimer";
import { BreathingRoom } from "@/pages/BreathingRoom";
import { Zones } from "@/pages/Zones";
import { Schedule } from "@/pages/Schedule";
import { NowNext } from "@/pages/NowNext";
import { StarRewards } from "@/pages/StarRewards";
import { PickerWheel } from "@/pages/PickerWheel";
import { HelpModal } from "@/components/HelpModal";

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard onNavigate={setActiveView} />;
      case 'timer': return <FocusTimer />;
      case 'breathing': return <BreathingRoom />;
      case 'zones': return <Zones />;
      case 'schedule': return <Schedule />;
      case 'nownext': return <NowNext />;
      case 'rewards': return <StarRewards />;
      case 'wheel': return <PickerWheel />;
      default: return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative w-full text-gray-900 selection:bg-teal-200">
      <SiteHeader />
      <SiteNav activeView={activeView} onViewChange={setActiveView} />
      
      <main className="flex-1 w-full pt-8 pb-20 px-4 relative z-10">
        {activeView !== 'dashboard' && (
          <div className="max-w-6xl mx-auto mb-6 flex px-6">
            <Button 
              variant="ghost" 
              onClick={() => setActiveView('dashboard')}
              className="text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded-full pl-2 pr-4 font-medium"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to dashboard
            </Button>
          </div>
        )}
        
        <div className="transition-all duration-300">
          {renderView()}
        </div>
      </main>

      <footer className="w-full text-center py-8 text-teal-800/60 text-sm font-medium z-10 border-t border-teal-100/50 mt-auto bg-white/30 backdrop-blur-sm">
        Routinify — Classroom Operations
      </footer>

      {/* Floating Help Button */}
      <Button 
        onClick={() => setIsHelpOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full py-6 px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
      >
        <HelpCircle className="w-5 h-5 mr-2" />
        Workspace tips
      </Button>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;
