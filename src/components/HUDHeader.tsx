import { useEffect, useState } from "react";
import { getSettings } from "@/lib/adminStore";

const HUDHeader = () => {
  const [time, setTime] = useState(new Date());
  const settings = getSettings();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }).toUpperCase();

  return (
    <header className="glass-panel px-6 py-3 flex items-center justify-between relative scan-line">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-hud-green animate-pulse-glow" />
          <span className="text-xs text-muted-foreground tracking-widest uppercase">System Online</span>
        </div>
        <div className="hidden sm:block h-4 w-px bg-border" />
        <span className="hidden sm:block text-xs text-muted-foreground tracking-wider">SEC CLEARANCE: L5</span>
      </div>

      <h1 className="font-display text-sm sm:text-lg glow-text tracking-[0.2em] absolute left-1/2 -translate-x-1/2">
        {settings.siteTitle}
      </h1>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="hidden sm:block tracking-wider">{formatDate(time)}</span>
        <span className="font-display glow-text-sm tracking-wider tabular-nums">{formatTime(time)}</span>
      </div>
    </header>
  );
};

export default HUDHeader;
