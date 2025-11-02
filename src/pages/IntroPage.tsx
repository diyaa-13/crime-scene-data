import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";

const IntroPage = () => {
  const navigate = useNavigate();
  const [detectiveName, setDetectiveName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("detectiveName") || "Detective";
    setDetectiveName(name);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full bg-card/50 backdrop-blur-sm neon-border p-8 md:p-12 fade-in">
        <div className="space-y-8">
          <div className="flex items-center justify-center">
            <Bot className="w-16 h-16 text-primary animate-pulse-glow" />
          </div>

          <div className="space-y-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary terminal-text">
              Welcome, Detective {detectiveName}.
            </h2>
            
            <p className="text-xl md:text-2xl leading-relaxed">
              Let's begin our investigation with your AI partner, <span className="neon-text font-bold">'DataBot'</span>.
            </p>

            <div className="border-t border-b border-primary/30 py-6 my-6">
              <p className="text-lg md:text-xl text-primary font-semibold">
                💬 DataBot: Ready to dive into the database and expose the truth?
              </p>
            </div>

            <Button
              variant="neon"
              size="xl"
              onClick={() => navigate("/level/1")}
              className="min-w-[250px]"
            >
              BEGIN INVESTIGATION
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center terminal-text">
            &gt; DataBot online... Awaiting your command_
          </p>
        </div>
      </Card>
    </div>
  );
};

export default IntroPage;
