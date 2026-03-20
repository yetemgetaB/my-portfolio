import { useState } from "react";

const StatusItem = ({ label, status, color }: { label: string; status: string; color: string }) => (
  <div className="flex items-center justify-between py-1.5">
    <div className="flex items-center gap-2">
      <div className={`status-dot ${color}`} />
      <span className="text-xs text-foreground">{label}</span>
    </div>
    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{status}</span>
  </div>
);

const Toggle = ({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className="flex items-center justify-between w-full py-1.5 group"
    >
      <span className="text-xs text-foreground">{label}</span>
      <div className={`w-8 h-4 rounded-full transition-colors duration-200 relative ${on ? "bg-hud-cyan/30" : "bg-muted"}`}>
        <div
          className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-200 ${
            on ? "left-[18px] bg-hud-cyan shadow-[0_0_6px_hsl(180_100%_50%/0.5)]" : "left-0.5 bg-muted-foreground"
          }`}
        />
      </div>
    </button>
  );
};

const objectives = [
  { text: "Deploy portfolio v2.4", done: true },
  { text: "Optimize render pipeline", done: true },
  { text: "Integrate telemetry API", done: false },
  { text: "Ship contact module", done: false },
];

const LeftPanel = () => (
  <aside className="glass-panel p-4 flex flex-col gap-5 h-full overflow-y-auto">
    {/* System Status */}
    <section>
      <h3 className="font-display text-[10px] glow-text-sm tracking-[0.15em] mb-3 pb-1 border-b border-border">
        ◆ System Status
      </h3>
      <div className="space-y-0.5">
        <StatusItem label="React Engine" status="Active" color="bg-hud-green" />
        <StatusItem label="TypeScript Core" status="Active" color="bg-hud-green" />
        <StatusItem label="Tailwind CSS" status="Active" color="bg-hud-green" />
        <StatusItem label="Node Runtime" status="Standby" color="bg-hud-amber" />
        <StatusItem label="Database Link" status="Offline" color="bg-hud-red" />
      </div>
    </section>

    {/* Toggles */}
    <section>
      <h3 className="font-display text-[10px] glow-text-sm tracking-[0.15em] mb-3 pb-1 border-b border-border">
        ◆ Subsystems
      </h3>
      <div className="space-y-0.5">
        <Toggle label="Dark Mode Override" defaultOn />
        <Toggle label="Animation Engine" defaultOn />
        <Toggle label="Debug Overlay" />
        <Toggle label="Performance Monitor" defaultOn />
      </div>
    </section>

    {/* Mission Objectives */}
    <section>
      <h3 className="font-display text-[10px] glow-text-sm tracking-[0.15em] mb-3 pb-1 border-b border-border">
        ◆ Mission Objectives
      </h3>
      <div className="space-y-2">
        {objectives.map((obj, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className={`text-xs mt-px ${obj.done ? "text-hud-green" : "text-muted-foreground"}`}>
              {obj.done ? "[✓]" : "[ ]"}
            </span>
            <span className={`text-xs ${obj.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {obj.text}
            </span>
          </div>
        ))}
      </div>
    </section>

    {/* Quick Nav */}
    <section className="mt-auto">
      <h3 className="font-display text-[10px] glow-text-sm tracking-[0.15em] mb-3 pb-1 border-b border-border">
        ◆ Navigation
      </h3>
      <div className="space-y-1">
        {["About", "Projects", "Skills", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="block text-xs py-1.5 px-2 rounded text-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200"
          >
            {">"} {item.toUpperCase()}
          </a>
        ))}
      </div>
    </section>
  </aside>
);

export default LeftPanel;
