import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

const TitleScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20"></div>
      
      {/* Scanning line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scan-line"></div>

      <div className="relative z-10 text-center fade-in space-y-8 px-4">
        <div className="flex items-center justify-center mb-6">
          <Terminal className="w-16 h-16 text-primary animate-pulse-glow" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold neon-text tracking-wider">
          🕵️ MURDER
        </h1>
        <h2 className="text-4xl md:text-6xl font-bold neon-text tracking-wider">
          IN ROOM M3
        </h2>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mt-6">
          A DATA-DRIVEN DETECTIVE INVESTIGATION
        </p>
        
        <div className="mt-12">
          <Button
            variant="neon"
            size="xl"
            onClick={() => navigate("/story")}
            className="group relative overflow-hidden"
          >
            <span className="relative z-10">START INVESTIGATION</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground terminal-text">
          &gt; SYSTEM READY_
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;
