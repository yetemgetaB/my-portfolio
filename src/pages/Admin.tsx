import { useState, useEffect } from "react";
import {
  adminLogin,
  isAdminLoggedIn,
  adminLogout,
  getSettings,
  saveSettings,
  type AdminSettings,
} from "@/lib/adminStore";

const Admin = () => {
  const [authed, setAuthed] = useState(isAdminLoggedIn());
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!authed) {
    return (
      <div className="min-h-screen bg-background circuit-bg flex items-center justify-center p-4">
        <div className="glass-panel p-8 w-full max-w-sm">
          <h1 className="font-display text-lg glow-text tracking-[0.2em] text-center mb-6">
            ADMIN ACCESS
          </h1>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (adminLogin(password)) setAuthed(true);
                  else setError("ACCESS DENIED");
                }
              }}
              placeholder="Enter clearance code…"
              className="w-full bg-muted/30 border border-border rounded px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono"
            />
            {error && <p className="text-hud-red text-xs text-center">{error}</p>}
            <button
              onClick={() => {
                if (adminLogin(password)) setAuthed(true);
                else setError("ACCESS DENIED");
              }}
              className="cockpit-btn w-full"
            >
              ▷ AUTHENTICATE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => { adminLogout(); setAuthed(false); }} />;
};

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [settings, setSettings] = useState<AdminSettings>(getSettings());
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("profile");

  const update = (patch: Partial<AdminSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: "profile", label: "Profile" },
    { id: "objectives", label: "Objectives" },
    { id: "skills", label: "Skills" },
    { id: "telemetry", label: "Telemetry" },
    { id: "github", label: "GitHub" },
  ];

  return (
    <div className="min-h-screen bg-background circuit-bg">
      {/* Header */}
      <header className="glass-panel px-6 py-3 flex items-center justify-between scan-line">
        <h1 className="font-display text-sm glow-text tracking-[0.2em]">ADMIN CONSOLE</h1>
        <div className="flex items-center gap-3">
          {saved && <span className="text-hud-green text-xs animate-float-up">✓ Settings saved</span>}
          <button onClick={handleSave} className="cockpit-btn text-[10px]">▷ SAVE</button>
          <button onClick={onLogout} className="cockpit-btn text-[10px] border-hud-red/40 text-hud-red hover:bg-hud-red/10">
            ▷ LOGOUT
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-52px)]">
        {/* Sidebar */}
        <nav className="w-48 glass-panel m-2 p-3 shrink-0">
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-3">Sections</p>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`block w-full text-left text-xs py-2 px-3 rounded mb-1 transition-colors ${
                activeSection === s.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-2xl space-y-6">
            {activeSection === "profile" && (
              <AdminSection title="Profile Settings">
                <Field label="Site Title" value={settings.siteTitle} onChange={(v) => update({ siteTitle: v })} />
                <Field label="Name" value={settings.userName} onChange={(v) => update({ userName: v })} />
                <Field label="Role" value={settings.userRole} onChange={(v) => update({ userRole: v })} />
                <Field label="Location" value={settings.userLocation} onChange={(v) => update({ userLocation: v })} />
                <Field label="Bio" value={settings.userBio} onChange={(v) => update({ userBio: v })} multiline />
                <Field label="Email" value={settings.email} onChange={(v) => update({ email: v })} />
                <Field label="GitHub URL" value={settings.githubUrl} onChange={(v) => update({ githubUrl: v })} />
                <Field label="LinkedIn URL" value={settings.linkedinUrl} onChange={(v) => update({ linkedinUrl: v })} />
                <Field label="CV URL" value={settings.cvUrl} onChange={(v) => update({ cvUrl: v })} />
              </AdminSection>
            )}

            {activeSection === "objectives" && (
              <AdminSection title="Mission Objectives">
                {settings.objectives.map((obj, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={obj.done}
                      onChange={(e) => {
                        const next = [...settings.objectives];
                        next[i] = { ...next[i], done: e.target.checked };
                        update({ objectives: next });
                      }}
                      className="accent-primary"
                    />
                    <input
                      value={obj.text}
                      onChange={(e) => {
                        const next = [...settings.objectives];
                        next[i] = { ...next[i], text: e.target.value };
                        update({ objectives: next });
                      }}
                      className="flex-1 bg-muted/30 border border-border rounded px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => {
                        const next = settings.objectives.filter((_, j) => j !== i);
                        update({ objectives: next });
                      }}
                      className="text-hud-red text-xs hover:text-destructive"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => update({ objectives: [...settings.objectives, { text: "New objective", done: false }] })}
                  className="cockpit-btn text-[10px] mt-2"
                >
                  + Add Objective
                </button>
              </AdminSection>
            )}

            {activeSection === "skills" && (
              <AdminSection title="Skills">
                {settings.skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input
                      value={skill.name}
                      onChange={(e) => {
                        const next = [...settings.skills];
                        next[i] = { ...next[i], name: e.target.value };
                        update({ skills: next });
                      }}
                      className="flex-1 bg-muted/30 border border-border rounded px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-primary"
                    />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={skill.pct}
                      onChange={(e) => {
                        const next = [...settings.skills];
                        next[i] = { ...next[i], pct: Number(e.target.value) };
                        update({ skills: next });
                      }}
                      className="w-16 bg-muted/30 border border-border rounded px-2 py-1.5 text-xs text-foreground font-mono text-center focus:outline-none focus:border-primary"
                    />
                    <span className="text-[10px] text-muted-foreground">%</span>
                    <button
                      onClick={() => update({ skills: settings.skills.filter((_, j) => j !== i) })}
                      className="text-hud-red text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => update({ skills: [...settings.skills, { name: "New Skill", pct: 50 }] })}
                  className="cockpit-btn text-[10px] mt-2"
                >
                  + Add Skill
                </button>
              </AdminSection>
            )}

            {activeSection === "telemetry" && (
              <AdminSection title="Telemetry Display">
                <Field label="Altitude" value={settings.telemetry.altitude} onChange={(v) => update({ telemetry: { ...settings.telemetry, altitude: v } })} />
                <Field label="Speed" value={settings.telemetry.speed} onChange={(v) => update({ telemetry: { ...settings.telemetry, speed: v } })} />
                <Field label="Fuel" value={settings.telemetry.fuel} onChange={(v) => update({ telemetry: { ...settings.telemetry, fuel: v } })} />
                <Field label="Heading" value={settings.telemetry.heading} onChange={(v) => update({ telemetry: { ...settings.telemetry, heading: v } })} />
              </AdminSection>
            )}

            {activeSection === "github" && (
              <AdminSection title="GitHub Settings">
                <div className="space-y-3">
                  <Field
                    label="GitHub Username"
                    value={localStorage.getItem("github_username") || "yetemgetaB"}
                    onChange={(v) => localStorage.setItem("github_username", v)}
                  />
                  <Field
                    label="GitHub Token (for higher API limits)"
                    value={localStorage.getItem("github_token") || ""}
                    onChange={(v) => {
                      if (v) localStorage.setItem("github_token", v);
                      else localStorage.removeItem("github_token");
                    }}
                    placeholder="ghp_xxxxxxxxxxxx"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Token is stored in localStorage. Without a token, you're limited to 60 API requests/hour.
                  </p>
                </div>
              </AdminSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="glass-panel p-5">
    <h2 className="font-display text-xs glow-text-sm tracking-[0.15em] mb-4 pb-2 border-b border-border">
      ◆ {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </section>
);

const Field = ({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) => (
  <div>
    <label className="text-[10px] text-muted-foreground tracking-wider uppercase block mb-1">{label}</label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-muted/30 border border-border rounded px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-primary resize-none"
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-muted/30 border border-border rounded px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-primary"
      />
    )}
  </div>
);

export default Admin;
