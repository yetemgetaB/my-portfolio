import { useEffect, useState } from "react";
import { useGitHubRepos, useGitHubUser } from "@/hooks/useGitHub";
import { getSettings } from "@/lib/adminStore";

const RightPanel = () => (
  <aside className="glass-panel p-4 flex flex-col gap-5 h-full overflow-y-auto">
    <FlightTelemetry />
    <RadarWidget />
    <GitHubStats />
    <LiveMetrics />
    <DataFeed />
  </aside>
);

const FlightTelemetry = () => {
  const settings = getSettings();
  const t = settings.telemetry;
  const metrics = [
    { label: "ALTITUDE", value: t.altitude, color: "text-hud-green" },
    { label: "SPEED", value: t.speed, color: "text-hud-cyan" },
    { label: "FUEL", value: t.fuel, color: "text-hud-amber" },
    { label: "HEADING", value: t.heading, color: "text-hud-blue" },
  ];

  return (
    <section>
      <h3 className="font-display text-[10px] glow-text-sm tracking-[0.15em] mb-3 pb-1 border-b border-border">
        ◆ Flight Telemetry
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((m) => (
          <div key={m.label} className="bg-muted/30 rounded p-2">
            <p className="text-[9px] text-muted-foreground tracking-widest">{m.label}</p>
            <p className={`text-sm font-display tabular-nums ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const RadarWidget = () => (
  <section>
    <h3 className="font-display text-[10px] glow-text-sm tracking-[0.15em] mb-3 pb-1 border-b border-border">
      ◆ Network Radar
    </h3>
    <div className="relative w-full aspect-square max-w-[160px] mx-auto">
      {/* Circles */}
      {[1, 2, 3].map((r) => (
        <div
          key={r}
          className="absolute rounded-full border border-primary/10"
          style={{
            width: `${r * 33}%`,
            height: `${r * 33}%`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
      {/* Cross */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-primary/10 -translate-x-1/2" />
      <div className="absolute left-0 right-0 top-1/2 h-px bg-primary/10 -translate-y-1/2" />
      {/* Sweep line — anchored to dead center */}
      <div
        className="absolute animate-radar-sweep"
        style={{
          top: "50%",
          left: "50%",
          width: 0,
          height: 0,
          transformOrigin: "0 0",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "-0.5px",
            width: "1px",
            height: "50cqmin",
            background: "linear-gradient(to top, hsl(180 100% 50% / 0.6), transparent)",
            containerType: "inline-size",
          }}
        />
      </div>
      {/* Blips */}
      {[
        { top: "25%", left: "60%", size: 4 },
        { top: "40%", left: "30%", size: 3 },
        { top: "65%", left: "70%", size: 3 },
        { top: "50%", left: "50%", size: 5 },
      ].map((blip, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-hud-cyan animate-pulse-glow"
          style={{
            top: blip.top,
            left: blip.left,
            width: blip.size,
            height: blip.size,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  </section>
);

const GitHubStats = () => {
  const { data: repos } = useGitHubRepos();
  const { data: user } = useGitHubUser();

  const totalStars = repos?.reduce((s, r) => s + r.stargazers_count, 0) ?? 0;
  const totalForks = repos?.reduce((s, r) => s + r.forks_count, 0) ?? 0;
  const languages = new Set(repos?.map((r) => r.language).filter(Boolean));

  return (
    <section>
      <h3 className="font-display text-[10px] glow-text-sm tracking-[0.15em] mb-3 pb-1 border-b border-border">
        ◆ GitHub Intel
      </h3>
      <div className="space-y-1.5">
        {[
          { label: "REPOS", value: user?.public_repos ?? "—" },
          { label: "STARS", value: totalStars },
          { label: "FORKS", value: totalForks },
          { label: "LANGUAGES", value: languages.size },
          { label: "FOLLOWERS", value: user?.followers ?? "—" },
        ].map((m) => (
          <div key={m.label} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{m.label}</span>
            <span className="text-hud-cyan tabular-nums font-display">{m.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const LiveMetrics = () => {
  const [vals, setVals] = useState([64, 78, 45, 91, 53]);

  useEffect(() => {
    const iv = setInterval(() => {
      setVals((prev) => prev.map((v) => Math.max(10, Math.min(100, v + (Math.random() - 0.5) * 12))));
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  const labels = ["RENDER", "BUNDLE", "PARSE", "DEPLOY", "CACHE"];

  return (
    <section>
      <h3 className="font-display text-[10px] glow-text-sm tracking-[0.15em] mb-3 pb-1 border-b border-border">
        ◆ Live Metrics
      </h3>
      <div className="flex items-end gap-1 h-20">
        {vals.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full bg-muted/30 rounded-sm overflow-hidden" style={{ height: "60px" }}>
              <div
                className="w-full rounded-sm transition-all duration-1000 ease-out"
                style={{
                  height: `${v}%`,
                  marginTop: `${100 - v}%`,
                  background: "linear-gradient(to top, hsl(180 100% 50% / 0.7), hsl(200 100% 60% / 0.3))",
                }}
              />
            </div>
            <span className="text-[8px] text-muted-foreground tracking-wider">{labels[i]}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const DataFeed = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const messages = [
      "[SYS] Render pipeline optimized",
      "[GIT] Repos fetched successfully",
      "[NET] API response: 200 OK",
      "[SEC] Auth token validated",
      "[DEP] Build deployed",
      "[SYS] Cache hit ratio: 94.2%",
      "[NET] WebSocket connected",
      "[GIT] Commit history synced",
    ];
    let idx = 0;
    const iv = setInterval(() => {
      setLogs((prev) => [...prev.slice(-5), messages[idx % messages.length]]);
      idx++;
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="mt-auto">
      <h3 className="font-display text-[10px] glow-text-sm tracking-[0.15em] mb-3 pb-1 border-b border-border">
        ◆ System Log
      </h3>
      <div className="bg-background/60 rounded p-2 h-28 overflow-hidden flex flex-col justify-end">
        {logs.map((log, i) => (
          <p key={`${i}-${log}`} className="text-[10px] text-muted-foreground leading-relaxed animate-float-up">
            {log}
          </p>
        ))}
        {logs.length === 0 && (
          <p className="text-[10px] text-muted-foreground/40">Awaiting data...</p>
        )}
      </div>
    </section>
  );
};

export default RightPanel;
