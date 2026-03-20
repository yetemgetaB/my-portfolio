import HUDHeader from "@/components/HUDHeader";
import LeftPanel from "@/components/LeftPanel";
import CenterPanel from "@/components/CenterPanel";
import RightPanel from "@/components/RightPanel";

const Index = () => (
  <div className="h-screen flex flex-col bg-background circuit-bg overflow-hidden">
    <HUDHeader />
    <div className="flex-1 grid grid-cols-1 md:grid-cols-[240px_1fr_240px] gap-2 p-2 min-h-0">
      {/* Left panel - hidden on mobile, shown as collapsible */}
      <div className="hidden md:block min-h-0">
        <LeftPanel />
      </div>
      <div className="min-h-0">
        <CenterPanel />
      </div>
      <div className="hidden md:block min-h-0">
        <RightPanel />
      </div>
    </div>

    {/* Mobile bottom nav */}
    <nav className="md:hidden glass-panel flex justify-around py-2 px-4">
      {["About", "Projects", "Skills", "Contact"].map((item) => (
        <a
          key={item}
          href={`#${item.toLowerCase()}`}
          className="text-[10px] font-display tracking-wider text-muted-foreground hover:text-primary transition-colors"
        >
          {item.toUpperCase()}
        </a>
      ))}
    </nav>
  </div>
);

export default Index;
