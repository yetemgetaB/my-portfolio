import { useGitHubUser } from "@/hooks/useGitHub";
import { getSettings } from "@/lib/adminStore";

const AboutView = () => {
  const { data: user, isLoading } = useGitHubUser();
  const settings = getSettings();

  const code = `const Developer = {
  name: "${user?.name || settings.userName}",
  role: "${settings.userRole}",
  location: "${user?.location || settings.userLocation}",
  github: "${user?.html_url || settings.githubUrl}",
  
  bio: "${user?.bio || settings.userBio}",
  
  repos: ${user?.public_repos ?? "…"},
  followers: ${user?.followers ?? "…"},
  following: ${user?.following ?? "…"},
  
  memberSince: "${user?.created_at ? new Date(user.created_at).getFullYear() : "…"}",

  philosophy: \`
    Code should read like prose,
    execute like poetry,
    and scale like infrastructure.
  \`,
};

export default Developer;`;

  if (isLoading) {
    return (
      <div className="animate-float-up space-y-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-4 bg-muted/30 rounded animate-pulse" style={{ width: `${40 + Math.random() * 50}%` }} />
        ))}
      </div>
    );
  }

  return (
    <div id="about" className="animate-float-up">
      <pre className="text-xs leading-relaxed overflow-x-auto">
        {code.split("\n").map((line, i) => (
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
};

function colorize(line: string) {
  return line
    .replace(/(const|export|default)/g, "<kw>$1</kw>")
    .split(/(<kw>.*?<\/kw>)/)
    .map((part, i) => {
      if (part.startsWith("<kw>")) {
        const word = part.replace(/<\/?kw>/g, "");
        return <span key={i} className="text-hud-cyan">{word}</span>;
      }
      const stringParts = part.split(/(["'`].*?["'`])/);
      return stringParts.map((sp, j) => {
        if (/^["'`]/.test(sp)) {
          return <span key={`${i}-${j}`} className="text-hud-green">{sp}</span>;
        }
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

export default AboutView;
