import { useState } from "react";
import { useGitHubRepos, useGitHubReadme, useGitHubCommits, useGitHubLanguages } from "@/hooks/useGitHub";
import { getSettings } from "@/lib/adminStore";
import { getUsername } from "@/lib/github";
import AboutView from "./center/AboutView";
import ProjectsView from "./center/ProjectsView";
import SkillsView from "./center/SkillsView";
import ContactView from "./center/ContactView";
import RepoExplorer from "./center/RepoExplorer";

type Tab = "about" | "projects" | "skills" | "contact" | "repo";

const CenterPanel = () => {
  const [tab, setTab] = useState<Tab>("about");
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [showTree, setShowTree] = useState(false);
  const { data: repos, isLoading: reposLoading, error: reposError } = useGitHubRepos();

  const tabs: { id: Tab; label: string }[] = [
    { id: "about", label: "about.tsx" },
    { id: "projects", label: "projects.tsx" },
    { id: "skills", label: "skills.ts" },
    { id: "contact", label: "contact.tsx" },
    ...(selectedRepo ? [{ id: "repo" as Tab, label: `${selectedRepo}/` }] : []),
  ];

  const openRepo = (repoName: string) => {
    setSelectedRepo(repoName);
    setTab("repo");
  };

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
            {t.id === "repo" && (
              <span
                className="ml-2 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRepo(null);
                  setTab("projects");
                }}
              >
                ×
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-1 min-h-0">
        {/* File tree - GitHub repos */}
        {showTree && (
          <div className="w-48 shrink-0 border-r border-border p-2 overflow-y-auto">
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-2 px-1">
              {getUsername()} /
            </p>
            {reposLoading && (
              <div className="space-y-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-5 bg-muted/30 rounded animate-pulse" />
                ))}
              </div>
            )}
            {reposError && (
              <p className="text-[10px] text-hud-red px-1">Failed to load repos</p>
            )}
            {repos?.map((repo) => (
              <button
                key={repo.id}
                onClick={() => openRepo(repo.name)}
                className={`flex items-center gap-1.5 w-full py-1 text-xs hover:bg-primary/5 rounded px-1.5 text-left ${
                  selectedRepo === repo.name ? "bg-primary/10 text-primary" : "text-muted-foreground"
                }`}
              >
                <span className="text-[10px]">📁</span>
                <span className="truncate">{repo.name}</span>
                {repo.language && (
                  <span className="ml-auto text-[8px] text-muted-foreground/60">{repo.language}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === "about" && <AboutView />}
          {tab === "projects" && <ProjectsView repos={repos || []} loading={reposLoading} error={reposError} onOpenRepo={openRepo} />}
          {tab === "skills" && <SkillsView />}
          {tab === "contact" && <ContactView />}
          {tab === "repo" && selectedRepo && <RepoExplorer repoName={selectedRepo} />}
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
          <span>{repos?.length ?? "—"} repos</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
};

export default CenterPanel;
