import { useEffect } from "react";
import { LayoutGrid } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative w-full h-screen bg-[#0B0C0E] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Solar Orange Glow */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,122,0,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="flex flex-col items-center z-10 animate-fade-in-up">
        {/* Glowing Logo */}
        <div className="w-16 h-16 rounded-2xl bg-[#14151B] border border-[#FF7A00]/40 flex items-center justify-center text-[#FF7A00] shadow-[0_0_30px_rgba(255,122,0,0.35)] mb-4">
          <LayoutGrid size={32} className="stroke-[2.2]" />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white">
          Offline Compute Grid
        </h1>
        <p className="text-xs text-[#FF7A00] font-mono tracking-widest uppercase mt-1">
          v1.0.0 • Solar Engine
        </p>

        {/* Loading Spinner / Bar */}
        <div className="w-36 h-1.5 bg-[#18191E] rounded-full overflow-hidden mt-6 border border-[#24262E]">
          <div className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FF5500] rounded-full animate-pulse w-3/4 shadow-[0_0_8px_rgba(255,122,0,0.6)]" />
        </div>
      </div>
    </div>
  );
}
