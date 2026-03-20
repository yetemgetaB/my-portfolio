import { useState } from "react";
import { useGitHubRepos } from "@/hooks/useGitHub";
import { getSettings } from "@/lib/adminStore";

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
      className="flex items-center justify-between w-full py-1.5 group active:scale-[0.97] transition-transform"
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

const LeftPanel = () => {
  const { data: repos, isLoading } = useGitHubRepos();
  const settings = getSettings();

  const repoCount = repos?.length ?? 0;
  const hasData = !isLoading && repos;

  return (
    <aside className="glass-panel p-4 flex flex-col gap-5 h-full overflow-y-auto">
      {/* System Status */}
      <section>
        <h3 className="font-display text-[10px] glow-text-sm tracking-[0.15em] mb-3 pb-1 border-b border-border">
          ◆ System Status
        </h3>
        <div className="space-y-0.5">
          <StatusItem label="React Engine" status="Active" color="bg-hud-green" />
          <StatusItem label="TypeScript Core" status="Active" color="bg-hud-green" />
          <StatusItem label="GitHub API" status={hasData ? "Connected" : isLoading ? "Syncing…" : "Error"} color={hasData ? "bg-hud-green" : isLoading ? "bg-hud-amber" : "bg-hud-red"} />
          <StatusItem label="Repositories" status={`${repoCount} loaded`} color={repoCount > 0 ? "bg-hud-green" : "bg-hud-amber"} />
          <StatusItem label="Tailwind CSS" status="Active" color="bg-hud-green" />
        </div>
      </section>

      {/* Subsystems */}
      <section>
        <h3 className="font-display text-[10px] glow-text-sm tracking-[0.15em] mb-3 pb-1 border-b border-border">
          ◆ Subsystems
        </h3>
        <div className="space-y-0.5">
          <Toggle label="INIT SYSTEM" defaultOn />
          <Toggle label="LOAD PROJECTS" defaultOn />
          <Toggle label="DISPLAY SKILLS" defaultOn />
          <Toggle label="OPEN CV" />
          <Toggle label="CONTACT" defaultOn />
        </div>
      </section>

      {/* Mission Objectives */}
      <section>
        <h3 className="font-display text-[10px] glow-text-sm tracking-[0.15em] mb-3 pb-1 border-b border-border">
          ◆ Mission Objectives
        </h3>
        <div className="space-y-2">
          {settings.objectives.map((obj, i) => (
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
        {/* Progress */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Mission Progress</span>
            <span>{Math.round((settings.objectives.filter((o) => o.done).length / settings.objectives.length) * 100)}%</span>
          </div>
          <div className="progress-hud">
            <div
              className="progress-hud-fill"
              style={{ width: `${(settings.objectives.filter((o) => o.done).length / settings.objectives.length) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* Flight Logs */}
      <section>
        <h3 className="font-display text-[10px] glow-text-sm tracking-[0.15em] mb-3 pb-1 border-b border-border">
          ◆ Flight Logs
        </h3>
        <div className="space-y-1.5">
          {repos?.slice(0, 4).map((r) => (
            <div key={r.id} className="text-[10px] text-muted-foreground">
              <span className="text-hud-cyan">[{new Date(r.updated_at).toLocaleDateString()}]</span>{" "}
              {r.name} updated
            </div>
          )) || (
            <p className="text-[10px] text-muted-foreground/50">Loading flight logs…</p>
          )}
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
              className="block text-xs py-1.5 px-2 rounded text-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200 active:scale-[0.97]"
            >
              {">"} {item.toUpperCase()}
            </a>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default LeftPanel;
