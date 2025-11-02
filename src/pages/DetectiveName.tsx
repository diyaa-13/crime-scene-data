import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserCircle } from "lucide-react";

const DetectiveName = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleStart = () => {
    if (name.trim()) {
      localStorage.setItem("detectiveName", name.trim());
      navigate("/intro");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-card/50 backdrop-blur-sm neon-border p-8 fade-in">
        <div className="space-y-6">
          <div className="flex justify-center">
            <UserCircle className="w-20 h-20 text-primary animate-pulse-glow" />
          </div>

          <h1 className="text-3xl font-bold text-center neon-text">
            DETECTIVE IDENTIFICATION
          </h1>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="detective-name" className="text-lg text-primary">
                Enter Your Detective Name
              </Label>
              <Input
                id="detective-name"
                type="text"
                placeholder="Detective..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleStart()}
                className="mt-2 bg-input/50 border-primary/50 text-lg focus:neon-border"
                autoFocus
              />
            </div>

            <Button
              variant="neon"
              size="lg"
              onClick={handleStart}
              disabled={!name.trim()}
              className="w-full"
            >
              BEGIN INVESTIGATION
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center terminal-text">
            &gt; Awaiting credentials_
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DetectiveName;
