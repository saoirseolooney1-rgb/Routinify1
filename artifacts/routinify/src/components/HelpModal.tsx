import { FC } from "react";
import { Compass, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-teal-700">
              <Compass className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Quick help</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-teal-50 text-teal-900 rounded-xl">
              <h3 className="font-semibold mb-1">1. Customize your view</h3>
              <p className="text-sm opacity-90">Use the dashboard layout toggle to show or hide widgets based on your daily needs.</p>
            </div>
            <div className="p-4 bg-sky-50 text-sky-900 rounded-xl">
              <h3 className="font-semibold mb-1">2. Keep it fresh</h3>
              <p className="text-sm opacity-90">Tools like the Picker Wheel and Star Rewards reset instantly so you can use them multiple times a day.</p>
            </div>
            <div className="p-4 bg-indigo-50 text-indigo-900 rounded-xl">
              <h3 className="font-semibold mb-1">3. Always available</h3>
              <p className="text-sm opacity-90">Your quick notes and layout preferences are saved automatically for your next session.</p>
            </div>
          </div>
          
          <div className="mt-6">
            <Button onClick={onClose} className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-6 text-base shadow-sm hover:shadow-md transition-all">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
