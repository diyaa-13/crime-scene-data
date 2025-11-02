import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { levels, tablesInfo } from "@/lib/gameData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lightbulb, Database, Play, ArrowRight, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const LevelPage = () => {
  const { levelNum } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showTables, setShowTables] = useState(false);
  const [showTableData, setShowTableData] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [detectiveName, setDetectiveName] = useState("");

  const levelIndex = parseInt(levelNum || "1") - 1;
  const currentLevel = levels[levelIndex];

  useEffect(() => {
    const name = localStorage.getItem("detectiveName") || "Detective";
    setDetectiveName(name);
  }, []);

  const normalizeQuery = (q: string) => {
    return q.trim().toLowerCase().replace(/\s+/g, " ").replace(/;$/, "");
  };

  const handleRunQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "DataBot: Type a query, Detective!",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate query execution (in production, this would call your edge function)
      const normalizedUserQuery = normalizeQuery(query);
      const normalizedExpectedQuery = normalizeQuery(currentLevel.expectedQuery);

      // For now, just check if queries match (simplified)
      if (normalizedUserQuery === normalizedExpectedQuery) {
        setIsCorrect(true);
        setQueryResult({ success: true, message: "Query executed successfully!" });
        toast({
          title: "✅ Correct!",
          description: `Detective ${detectiveName}: Good. Let's move on...`,
        });
      } else {
        setIsCorrect(false);
        setQueryResult({ success: false, message: "Query doesn't match expected output" });
        toast({
          title: "❌ Not quite right",
          description: "DataBot: That didn't quite work. Try again!",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute query",
        variant: "destructive",
      });
    }
  };

  const handleNextLevel = () => {
    if (currentLevel.number < levels.length) {
      navigate(`/level/${currentLevel.number + 1}`);
      setQuery("");
      setQueryResult(null);
      setIsCorrect(false);
    } else {
      navigate("/final");
    }
  };

  const handleViewTableData = (tableName: string) => {
    setSelectedTable(tableName);
    setShowTableData(true);
    // In production, fetch actual table data
    setTableData([
      { column1: "Sample", column2: "Data", column3: "Here" }
    ]);
  };

  if (!currentLevel) {
    return <div>Level not found</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-card/50 backdrop-blur-sm neon-border p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold neon-text">
              {currentLevel.title}
            </h1>
            <div className="text-sm text-muted-foreground terminal-text">
              {currentLevel.number} / {levels.length}
            </div>
          </div>
        </Card>

        {/* Level Description */}
        <Card className="bg-card/50 backdrop-blur-sm neon-border p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-2">OBJECTIVE:</h2>
              <p className="text-lg">{currentLevel.description}</p>
            </div>
            <div className="border-t border-primary/30 pt-4">
              <p className="text-primary font-semibold">💬 DataBot: </p>
              <p className="text-lg mt-2">{currentLevel.clue}</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button
            variant="detective"
            onClick={() => setShowHint(!showHint)}
          >
            <Lightbulb className="mr-2" />
            {showHint ? "Hide Hint" : "Show Hint"}
          </Button>
          <Button
            variant="detective"
            onClick={() => setShowTables(!showTables)}
          >
            <Database className="mr-2" />
            View Tables Info
          </Button>
        </div>

        {/* Hint */}
        {showHint && (
          <Card className="bg-primary/10 border-primary/50 p-4 fade-in">
            <p className="text-primary">💡 Hint: {currentLevel.hint}</p>
          </Card>
        )}

        {/* Tables Info */}
        {showTables && (
          <Card className="bg-card/50 backdrop-blur-sm neon-border p-6 fade-in">
            <h3 className="text-xl font-bold text-primary mb-4">TABLE REFERENCE:</h3>
            <div className="space-y-3">
              {Object.entries(tablesInfo).map(([table, description]) => (
                <div key={table} className="flex items-start justify-between gap-4 border-b border-primary/20 pb-2">
                  <div>
                    <span className="font-semibold text-primary terminal-text">{table}</span>
                    <span className="text-muted-foreground">: {description}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleViewTableData(table)}
                    className="text-xs"
                  >
                    View Data
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Query Editor */}
        <Card className="bg-card/50 backdrop-blur-sm neon-border p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">SQL QUERY TERMINAL:</h3>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              className="min-h-[150px] font-mono bg-input/50 border-primary/50 focus:neon-border text-terminal-green"
            />
            <Button
              variant="neon"
              size="lg"
              onClick={handleRunQuery}
              className="w-full md:w-auto"
            >
              <Play className="mr-2" />
              RUN QUERY
            </Button>
          </div>
        </Card>

        {/* Query Result */}
        {queryResult && (
          <Card className={`p-6 fade-in ${isCorrect ? 'bg-primary/10 border-primary' : 'bg-destructive/10 border-destructive'}`}>
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <>
                  <Check className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold text-primary">✅ Correct!</p>
                    <p className="text-sm text-muted-foreground">Detective {detectiveName}: Good. Let's move on...</p>
                  </div>
                </>
              ) : (
                <>
                  <X className="w-6 h-6 text-destructive" />
                  <div>
                    <p className="font-semibold text-destructive">❌ Not quite right</p>
                    <p className="text-sm text-muted-foreground">DataBot: That didn't quite work. Try again!</p>
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Next Level Button */}
        {isCorrect && (
          <Button
            variant="neon"
            size="xl"
            onClick={handleNextLevel}
            className="w-full md:w-auto fade-in"
          >
            {currentLevel.number < levels.length ? (
              <>
                NEXT LEVEL
                <ArrowRight className="ml-2" />
              </>
            ) : (
              <>
                FINAL REVEAL
                <ArrowRight className="ml-2" />
              </>
            )}
          </Button>
        )}
      </div>

      {/* Table Data Dialog */}
      <Dialog open={showTableData} onOpenChange={setShowTableData}>
        <DialogContent className="max-w-4xl bg-card neon-border">
          <DialogHeader>
            <DialogTitle className="text-2xl neon-text">{selectedTable.toUpperCase()} DATA</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-primary">Column 1</TableHead>
                  <TableHead className="text-primary">Column 2</TableHead>
                  <TableHead className="text-primary">Column 3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.column1}</TableCell>
                    <TableCell>{row.column2}</TableCell>
                    <TableCell>{row.column3}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LevelPage;
