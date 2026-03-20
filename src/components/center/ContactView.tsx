import { getSettings } from "@/lib/adminStore";
import { useGitHubUser } from "@/hooks/useGitHub";

const ContactView = () => {
  const settings = getSettings();
  const { data: user } = useGitHubUser();

  const contactLines = [
    "$ whoami",
    `  ${user?.login || settings.userName}`,
    "",
    "$ cat contact.env",
    `  EMAIL="${settings.email || "—"}"`,
    `  GITHUB="${user?.html_url || settings.githubUrl}"`,
    `  LINKEDIN="${settings.linkedinUrl || "—"}"`,
    `  BLOG="${user?.blog || "—"}"`,
    "",
    "$ echo $STATUS",
    '  "Open to opportunities"',
    "",
    "$ ping —",
    "  PONG — response time < 24h",
    "",
    "█",
  ];

  return (
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
        {settings.email && (
          <a href={`mailto:${settings.email}`} className="cockpit-btn">
            ▷ Send Transmission
          </a>
        )}
        <a href={settings.cvUrl} className="cockpit-btn">
          ▷ Download CV
        </a>
      </div>
    </div>
  );
};

export default ContactView;
