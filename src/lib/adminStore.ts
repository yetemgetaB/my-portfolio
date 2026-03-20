// Simple admin store using localStorage
const ADMIN_PASSWORD = "flightcontrol2024";
const ADMIN_KEY = "fc_admin_auth";
const SETTINGS_KEY = "fc_admin_settings";

export interface AdminSettings {
  siteTitle: string;
  userName: string;
  userRole: string;
  userLocation: string;
  userBio: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  cvUrl: string;
  objectives: { text: string; done: boolean }[];
  skills: { name: string; pct: number }[];
  telemetry: {
    altitude: string;
    speed: string;
    fuel: string;
    heading: string;
  };
}

const defaultSettings: AdminSettings = {
  siteTitle: "FLIGHT CONTROL",
  userName: "yetemgetaB",
  userRole: "Full-Stack Developer",
  userLocation: "Earth",
  userBio: "Building systems that feel like the future.",
  email: "",
  githubUrl: "https://github.com/yetemgetaB",
  linkedinUrl: "",
  cvUrl: "#",
  objectives: [
    { text: "Deploy portfolio v2.4", done: true },
    { text: "Optimize render pipeline", done: true },
    { text: "Integrate GitHub API", done: true },
    { text: "Ship contact module", done: false },
  ],
  skills: [
    { name: "React / Next.js", pct: 95 },
    { name: "TypeScript", pct: 92 },
    { name: "Node.js", pct: 88 },
    { name: "System Design", pct: 85 },
    { name: "PostgreSQL", pct: 82 },
    { name: "Rust / WASM", pct: 68 },
    { name: "DevOps / CI-CD", pct: 78 },
  ],
  telemetry: {
    altitude: "FL350",
    speed: "MACH 0.82",
    fuel: "72%",
    heading: "NNE 024°",
  },
};

export function adminLogin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(ADMIN_KEY, "true");
    return true;
  }
  return false;
}

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(ADMIN_KEY) === "true";
}

export function adminLogout(): void {
  sessionStorage.removeItem(ADMIN_KEY);
}

export function getSettings(): AdminSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch {}
  return defaultSettings;
}

export function saveSettings(settings: Partial<AdminSettings>): void {
  const current = getSettings();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
}
