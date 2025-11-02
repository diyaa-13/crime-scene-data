import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { storyText } from "@/lib/gameData";
import { AlertTriangle } from "lucide-react";

const StoryPage = () => {
  const navigate = useNavigate();
  const [showRefuse, setShowRefuse] = useState(false);

  const handleAccept = () => {
    navigate("/detective-name");
  };

  const handleRefuse = () => {
    setShowRefuse(true);
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  if (showRefuse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center fade-in">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-destructive">CASE DECLINED</h2>
          <p className="text-xl text-muted-foreground mt-4">
            Maybe next time, Detective. Case closed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full bg-card/50 backdrop-blur-sm neon-border p-8 md:p-12 fade-in">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center neon-text mb-8">
            CASE FILE #M3-2025
          </h1>
          
          <div className="space-y-4 text-lg leading-relaxed whitespace-pre-line terminal-text">
            {storyText}
          </div>

          <div className="border-t border-primary/30 pt-6 mt-8">
            <p className="text-xl font-semibold text-center mb-6 text-primary">
              DO YOU ACCEPT THIS CASE?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="neon"
                size="lg"
                onClick={handleAccept}
                className="min-w-[200px]"
              >
                ✅ ACCEPT CASE
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleRefuse}
                className="min-w-[200px] border-destructive text-destructive hover:bg-destructive/10"
              >
                ❌ REFUSE CASE
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StoryPage;
