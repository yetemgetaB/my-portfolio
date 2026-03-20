import { useState } from "react";

const files = [
  { name: "about.tsx", icon: "📄", active: true },
  { name: "projects.tsx", icon: "📄", active: false },
  { name: "skills.ts", icon: "📄", active: false },
  { name: "contact.tsx", icon: "📄", active: false },
];

const fileTree = [
  { name: "src/", indent: 0, folder: true },
  { name: "components/", indent: 1, folder: true },
  { name: "HUDHeader.tsx", indent: 2, folder: false },
  { name: "LeftPanel.tsx", indent: 2, folder: false },
  { name: "CenterPanel.tsx", indent: 2, folder: false },
  { name: "RightPanel.tsx", indent: 2, folder: false },
  { name: "pages/", indent: 1, folder: true },
  { name: "about.tsx", indent: 2, folder: false },
  { name: "projects.tsx", indent: 2, folder: false },
  { name: "skills.ts", indent: 2, folder: false },
  { name: "contact.tsx", indent: 2, folder: false },
];

const aboutCode = `const Developer = {
  name: "Alex Rivera",
  role: "Full-Stack Engineer",
  location: "San Francisco, CA",
  
  passion: "Building systems that feel
    like the future — performant,
    elegant, and precise.",
  
  experience: "5+ years shipping
    production applications across
    fintech, aerospace & developer
    tools.",

  philosophy: \`
    Code should read like prose,
    execute like poetry,
    and scale like infrastructure.
  \`,
};

export default Developer;`;

const projectsData = [
  {
    name: "NEBULA-UI",
    desc: "Design system with 40+ components, dark-first, accessible",
    tech: ["React", "TypeScript", "Storybook"],
    status: "DEPLOYED",
  },
  {
    name: "DATASTREAM",
    desc: "Real-time analytics dashboard with live WebSocket feeds",
    tech: ["Next.js", "D3", "PostgreSQL"],
    status: "DEPLOYED",
  },
  {
    name: "CIPHERLINK",
    desc: "E2E encrypted messaging app with zero-knowledge proofs",
    tech: ["Rust", "WebAssembly", "React"],
    status: "BETA",
  },
  {
    name: "ORBITAL",
    desc: "Satellite telemetry viewer for educational institutions",
    tech: ["Three.js", "Node.js", "Redis"],
    status: "IN DEV",
  },
];

const skillsData = [
  { name: "React / Next.js", pct: 95 },
  { name: "TypeScript", pct: 92 },
  { name: "Node.js", pct: 88 },
  { name: "System Design", pct: 85 },
  { name: "PostgreSQL", pct: 82 },
  { name: "Rust / WASM", pct: 68 },
  { name: "DevOps / CI-CD", pct: 78 },
];

const contactLines = [
  "$ whoami",
  "  alex.rivera",
  "",
  "$ cat contact.env",
  '  EMAIL="alex@devflight.io"',
  '  GITHUB="github.com/alexrivera"',
  '  LINKEDIN="linkedin.com/in/alexrivera"',
  "",
  "$ echo $STATUS",
  '  "Open to opportunities"',
  "",
  "$ ping alex@devflight.io",
  "  PONG — response time < 24h",
  "",
  "█",
];

type Tab = "about" | "projects" | "skills" | "contact";

const CenterPanel = () => {
  const [tab, setTab] = useState<Tab>("about");
  const [showTree, setShowTree] = useState(false);

  const tabs: { id: Tab; label: string }[] = [
    { id: "about", label: "about.tsx" },
    { id: "projects", label: "projects.tsx" },
    { id: "skills", label: "skills.ts" },
    { id: "contact", label: "contact.tsx" },
  ];

  return (
    <div className="glass-panel flex flex-col h-full overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center border-b border-border overflow-x-auto">
        <button
          onClick={() => setShowTree(!showTree)}
          className="px-3 py-2 text-xs text-muted-foreground hover:text-primary transition-colors shrink-0"
          title="Toggle file tree"
        >
          {showTree ? "◀" : "▶"}
        </button>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs border-b-2 transition-colors duration-200 shrink-0 ${
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 min-h-0">
        {/* File tree */}
        {showTree && (
          <div className="w-44 shrink-0 border-r border-border p-2 overflow-y-auto">
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-2 px-1">Explorer</p>
            {fileTree.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-1 py-0.5 text-xs hover:bg-primary/5 rounded px-1 cursor-default"
                style={{ paddingLeft: `${f.indent * 12 + 4}px` }}
              >
                <span className="text-muted-foreground text-[10px]">{f.folder ? "📁" : "📄"}</span>
                <span className={f.folder ? "text-foreground" : "text-muted-foreground"}>{f.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === "about" && <AboutView />}
          {tab === "projects" && <ProjectsView />}
          {tab === "skills" && <SkillsView />}
          {tab === "contact" && <ContactView />}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1 border-t border-border text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="status-dot bg-hud-green" /> main
          </span>
          <span>UTF-8</span>
          <span>TypeScript React</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
};

const AboutView = () => (
  <div id="about" className="animate-float-up">
    <pre className="text-xs leading-relaxed overflow-x-auto">
      {aboutCode.split("\n").map((line, i) => (
        <div key={i} className="flex">
          <span className="w-8 shrink-0 text-right pr-3 text-muted-foreground/40 select-none tabular-nums">
            {i + 1}
          </span>
          <code className="text-foreground">
            {colorize(line)}
          </code>
        </div>
      ))}
    </pre>
  </div>
);

function colorize(line: string) {
  return line
    .replace(/(const|export|default)/g, '<kw>$1</kw>')
    .split(/(<kw>.*?<\/kw>)/)
    .map((part, i) => {
      if (part.startsWith("<kw>")) {
        const word = part.replace(/<\/?kw>/g, "");
        return <span key={i} className="text-hud-cyan">{word}</span>;
      }
      // strings
      const stringParts = part.split(/(["'`].*?["'`])/);
      return stringParts.map((sp, j) => {
        if (/^["'`]/.test(sp)) {
          return <span key={`${i}-${j}`} className="text-hud-green">{sp}</span>;
        }
        // properties
        const propParts = sp.split(/(\w+)(?=:)/);
        return propParts.map((pp, k) => {
          if (/^\w+$/.test(pp) && sp.includes(pp + ":")) {
            return <span key={`${i}-${j}-${k}`} className="text-hud-blue">{pp}</span>;
          }
          return <span key={`${i}-${j}-${k}`}>{pp}</span>;
        });
      });
    });
}

const ProjectsView = () => (
  <div id="projects" className="space-y-3 animate-float-up">
    <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-2">
      // Active Deployments — {projectsData.length} missions
    </p>
    {projectsData.map((p, i) => (
      <div
        key={i}
        className="hud-border p-3 rounded hover:bg-primary/5 transition-colors duration-200 group cursor-default"
      >
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-display text-xs glow-text-sm tracking-wider">{p.name}</h4>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded tracking-wider ${
              p.status === "DEPLOYED"
                ? "bg-hud-green/10 text-hud-green"
                : p.status === "BETA"
                ? "bg-hud-amber/10 text-hud-amber"
                : "bg-hud-blue/10 text-hud-blue"
            }`}
          >
            {p.status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{p.desc}</p>
        <div className="flex gap-2 flex-wrap">
          {p.tech.map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const SkillsView = () => (
  <div id="skills" className="space-y-4 animate-float-up">
    <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-2">
      // Skill Telemetry — Real-time Assessment
    </p>
    {skillsData.map((s, i) => (
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

const ContactView = () => (
  <div id="contact" className="animate-float-up">
    <div className="bg-background/60 rounded p-4 font-mono">
      {contactLines.map((line, i) => (
        <div key={i} className="text-xs leading-relaxed">
          {line === "█" ? (
            <span className="inline-block w-2 h-4 bg-primary animate-blink" />
          ) : line.startsWith("$") ? (
            <span className="text-hud-green">{line}</span>
          ) : line.includes("=") ? (
            <>
              <span className="text-muted-foreground">{"  "}</span>
              <span className="text-hud-blue">{line.trim().split("=")[0]}</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-hud-amber">{line.trim().split("=")[1]}</span>
            </>
          ) : (
            <span className="text-muted-foreground">{line}</span>
          )}
        </div>
      ))}
    </div>
    <div className="flex gap-2 mt-4">
      <a href="mailto:alex@devflight.io" className="cockpit-btn">
        ▷ Send Transmission
      </a>
      <a href="#" className="cockpit-btn">
        ▷ Download CV
      </a>
    </div>
  </div>
);

export default CenterPanel;
