import type { GitHubRepo } from "@/lib/github";

interface Props {
  repos: GitHubRepo[];
  loading: boolean;
  error: Error | null;
  onOpenRepo: (name: string) => void;
}

const langColors: Record<string, string> = {
  TypeScript: "bg-hud-blue",
  JavaScript: "bg-hud-amber",
  Python: "bg-hud-green",
  Rust: "bg-hud-red",
  HTML: "bg-hud-amber",
  CSS: "bg-hud-cyan",
  Java: "bg-hud-red",
  Go: "bg-hud-cyan",
};

const ProjectsView = ({ repos, loading, error, onOpenRepo }: Props) => {
  if (loading) {
    return (
      <div className="space-y-3 animate-float-up">
        <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-2">
          // Fetching repositories…
        </p>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="hud-border p-3 rounded animate-pulse">
            <div className="h-4 bg-muted/30 rounded w-1/3 mb-2" />
            <div className="h-3 bg-muted/30 rounded w-2/3 mb-2" />
            <div className="flex gap-2">
              <div className="h-3 w-12 bg-muted/30 rounded" />
              <div className="h-3 w-12 bg-muted/30 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-float-up text-center py-8">
        <p className="text-hud-red text-sm mb-2">⚠ Failed to fetch repositories</p>
        <p className="text-xs text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div id="projects" className="space-y-3 animate-float-up">
      <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-2">
        // GitHub Repositories — {repos.length} found
      </p>
      {repos.map((repo) => (
        <button
          key={repo.id}
          onClick={() => onOpenRepo(repo.name)}
          className="hud-border p-3 rounded hover:bg-primary/5 transition-all duration-200 group cursor-pointer w-full text-left active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-display text-xs glow-text-sm tracking-wider uppercase">{repo.name}</h4>
            <div className="flex items-center gap-2">
              {repo.language && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className={`w-2 h-2 rounded-full ${langColors[repo.language] || "bg-muted-foreground"}`} />
                  {repo.language}
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{repo.description || "No description"}</p>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span>★ {repo.stargazers_count}</span>
            <span>⑂ {repo.forks_count}</span>
            <span>⊙ {repo.open_issues_count}</span>
            <span className="ml-auto">
              Updated {new Date(repo.updated_at).toLocaleDateString()}
            </span>
          </div>
          {repo.topics?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-2">
              {repo.topics.slice(0, 5).map((t) => (
                <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ProjectsView;
