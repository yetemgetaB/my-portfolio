import { useState } from "react";
import { useGitHubReadme, useGitHubCommits, useGitHubLanguages } from "@/hooks/useGitHub";

interface Props {
  repoName: string;
}

type SubTab = "readme" | "commits" | "languages";

const RepoExplorer = ({ repoName }: Props) => {
  const [subTab, setSubTab] = useState<SubTab>("readme");
  const { data: readme, isLoading: readmeLoading } = useGitHubReadme(repoName);
  const { data: commits, isLoading: commitsLoading } = useGitHubCommits(repoName);
  const { data: languages, isLoading: langsLoading } = useGitHubLanguages(repoName);

  const subTabs: { id: SubTab; label: string }[] = [
    { id: "readme", label: "README" },
    { id: "commits", label: "Commits" },
    { id: "languages", label: "Languages" },
  ];

  return (
    <div className="animate-float-up">
      {/* Sub-tabs */}
      <div className="flex gap-1 mb-4">
        {subTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`px-3 py-1 text-[10px] rounded tracking-wider uppercase transition-colors ${
              subTab === t.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* README */}
      {subTab === "readme" && (
        <div>
          {readmeLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-3 bg-muted/30 rounded animate-pulse" style={{ width: `${50 + Math.random() * 40}%` }} />
              ))}
            </div>
          ) : readme ? (
            <pre className="text-xs text-foreground leading-relaxed whitespace-pre-wrap overflow-x-auto bg-background/40 rounded p-4 max-h-96 overflow-y-auto">
              {readme}
            </pre>
          ) : (
            <p className="text-xs text-muted-foreground">No README found.</p>
          )}
        </div>
      )}

      {/* Commits */}
      {subTab === "commits" && (
        <div className="space-y-2">
          {commitsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted/30 rounded animate-pulse" />
              ))}
            </div>
          ) : commits?.length ? (
            commits.map((c) => (
              <a
                key={c.sha}
                href={c.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hud-border p-2 rounded hover:bg-primary/5 transition-colors"
              >
                <p className="text-xs text-foreground truncate">{c.commit.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-hud-cyan font-mono">{c.sha.slice(0, 7)}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {c.commit.author.name} · {new Date(c.commit.author.date).toLocaleDateString()}
                  </span>
                </div>
              </a>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">No commits found.</p>
          )}
        </div>
      )}

      {/* Languages */}
      {subTab === "languages" && (
        <div>
          {langsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-5 bg-muted/30 rounded animate-pulse" />
              ))}
            </div>
          ) : languages ? (
            <div className="space-y-3">
              {(() => {
                const total = Object.values(languages).reduce((a, b) => a + b, 0);
                return Object.entries(languages)
                  .sort(([, a], [, b]) => b - a)
                  .map(([lang, bytes]) => {
                    const pct = ((bytes / total) * 100).toFixed(1);
                    return (
                      <div key={lang}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-foreground">{lang}</span>
                          <span className="text-[10px] text-primary tabular-nums">{pct}%</span>
                        </div>
                        <div className="progress-hud">
                          <div className="progress-hud-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  });
              })()}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No language data.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RepoExplorer;
