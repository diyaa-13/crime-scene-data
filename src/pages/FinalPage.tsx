import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, RotateCcw, Home } from "lucide-react";

const FinalPage = () => {
  const navigate = useNavigate();
  const [suspect, setSuspect] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [detectiveName, setDetectiveName] = useState("");

  const correctSuspect = "isla gomez";

  useEffect(() => {
    const name = localStorage.getItem("detectiveName") || "Detective";
    setDetectiveName(name);
  }, []);

  const handleReveal = () => {
    const userAnswer = suspect.trim().toLowerCase();
    setIsCorrect(userAnswer === correctSuspect);
    setRevealed(true);
  };

  const handleReplay = () => {
    localStorage.removeItem("detectiveName");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full bg-card/50 backdrop-blur-sm neon-border p-8 md:p-12 fade-in">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center neon-text">
            FINAL STAGE: THE SUSPECT REVEAL
          </h1>

          {!revealed ? (
            <div className="space-y-6">
              <div className="border border-primary/30 rounded-lg p-6">
                <p className="text-xl text-primary font-semibold mb-4">
                  💬 DataBot: All clues point to one person… but I'll let you name them.
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-lg font-semibold text-primary block">
                  Who do you think did it?
                </label>
                <input
                  type="text"
                  value={suspect}
                  onChange={(e) => setSuspect(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && suspect.trim() && handleReveal()}
                  placeholder="Enter suspect name..."
                  className="w-full px-4 py-3 bg-input/50 border border-primary/50 rounded-md focus:outline-none focus:neon-border text-lg"
                  autoFocus
                />
              </div>

              <Button
                variant="neon"
                size="xl"
                onClick={handleReveal}
                disabled={!suspect.trim()}
                className="w-full md:w-auto"
              >
                REVEAL THE TRUTH
              </Button>
            </div>
          ) : (
            <div className="space-y-6 fade-in">
              {isCorrect ? (
                <>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-20 h-20 text-primary animate-pulse-glow" />
                  </div>

                  <div className="border border-primary rounded-lg p-6 bg-primary/10">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 text-center">
                      ✅ CORRECT! CASE SOLVED
                    </h2>
                    <div className="space-y-4 text-lg">
                      <p>
                        <span className="font-bold text-primary">Isla Gomez</span>, the Data Scientist, 
                        tried to erase her tracks using sanitizer and timing the CCTV blackout.
                      </p>
                      <p>
                        Her digital footprint revealed the truth: Wi-Fi sessions in M3 during the murder window, 
                        access logs inside the CCTV gap, and a suspicious purchase of cleaning supplies.
                      </p>
                      <p className="text-primary font-semibold">
                        Excellent work, Detective {detectiveName}. The data never lies.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center">
                    <AlertTriangle className="w-20 h-20 text-destructive" />
                  </div>

                  <div className="border border-destructive rounded-lg p-6 bg-destructive/10">
                    <h2 className="text-2xl md:text-3xl font-bold text-destructive mb-4 text-center">
                      NOT QUITE, DETECTIVE
                    </h2>
                    <div className="space-y-4 text-lg">
                      <p>
                        The real culprit was <span className="font-bold text-primary">Isla Gomez</span>.
                      </p>
                      <p>
                        The Data Scientist used her knowledge to manipulate the system, 
                        timing her attack during a CCTV blackout and attempting to sanitize all evidence.
                      </p>
                      <p className="text-muted-foreground">
                        You were close though — great investigation, Detective {detectiveName}!
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="border-t border-primary/30 pt-6 mt-8">
                <p className="text-xl text-center mb-6 text-primary">
                  💬 DataBot: {isCorrect ? "Excellent work" : "Good effort"}, Detective. Case closed.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="neon"
                    size="lg"
                    onClick={handleReplay}
                    className="min-w-[200px]"
                  >
                    <RotateCcw className="mr-2" />
                    REPLAY CASE
                  </Button>
                  
                  <Button
                    variant="detective"
                    size="lg"
                    onClick={() => navigate("/")}
                    className="min-w-[200px]"
                  >
                    <Home className="mr-2" />
                    MAIN MENU
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FinalPage;
