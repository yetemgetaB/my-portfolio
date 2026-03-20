import { getSettings } from "@/lib/adminStore";

const SkillsView = () => {
  const settings = getSettings();
  const skills = settings.skills;

  return (
    <div id="skills" className="space-y-4 animate-float-up">
      <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-2">
        // Skill Telemetry — Real-time Assessment
      </p>
      {skills.map((s, i) => (
        <div key={i}>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-foreground">{s.name}</span>
            <span className="text-[10px] text-primary tabular-nums">{s.pct}%</span>
          </div>
          <div className="progress-hud">
            <div
              className="progress-hud-fill"
              style={{
                width: `${s.pct}%`,
                animationDelay: `${i * 100}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsView;
