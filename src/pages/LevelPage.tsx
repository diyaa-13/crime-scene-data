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
  const [outputData, setOutputData] = useState<any[]>([]);

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
        setOutputData(currentLevel.sampleOutput);
        toast({
          title: "✅ Correct!",
          description: `Detective ${detectiveName}: Good. Let's move on...`,
        });
      } else {
        setIsCorrect(false);
        setQueryResult({ success: false, message: "Query doesn't match expected output" });
        setOutputData([]);
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
      setOutputData([]);
    } else {
      navigate("/final");
    }
  };

  const handleViewTableData = (tableName: string) => {
    setSelectedTable(tableName);
    setShowTableData(true);
    
    // Mock data for each table
    const tableDataMap: Record<string, any[]> = {
      persons: [
        { person_id: 1, name: 'Maya Archer', role: 'Reporter' },
        { person_id: 2, name: 'Noah Reed', role: 'CTO' },
        { person_id: 3, name: 'Olivia Park', role: 'Security Lead' },
        { person_id: 4, name: 'Liam Carter', role: 'DevOps' },
        { person_id: 5, name: 'Ava Brooks', role: 'HR Manager' },
        { person_id: 6, name: 'Ethan Price', role: 'Intern' },
        { person_id: 7, name: 'Isla Gomez', role: 'Data Scientist' },
        { person_id: 8, name: 'Mason Cole', role: 'Product Manager' },
      ],
      rooms: [
        { room_id: 1, name: 'M3', floor: 3 },
        { room_id: 2, name: 'ServerRoom', floor: 2 },
        { room_id: 3, name: 'Cafeteria', floor: 1 },
        { room_id: 4, name: 'Lobby', floor: 1 },
        { room_id: 5, name: 'ConferenceHall', floor: 2 },
      ],
      access_logs: [
        { log_id: 1, person_id: 1, room_id: 1, direction: 'IN', ts: '2025-10-02 00:08:00' },
        { log_id: 2, person_id: 3, room_id: 4, direction: 'IN', ts: '2025-10-02 00:05:00' },
        { log_id: 3, person_id: 3, room_id: 1, direction: 'IN', ts: '2025-10-02 00:10:00' },
        { log_id: 4, person_id: 3, room_id: 1, direction: 'OUT', ts: '2025-10-02 00:20:00' },
      ],
      wifi_sessions: [
        { session_id: 1, device_mac: 'AA:01:02:03:04:01', person_id: 1, ap_name: 'AP-M3', start_ts: '2025-10-02 00:08:00', end_ts: '2025-10-02 00:21:00' },
        { session_id: 2, device_mac: 'AA:01:02:03:04:02', person_id: 2, ap_name: 'AP-Conf', start_ts: '2025-10-02 00:05:00', end_ts: '2025-10-02 00:30:00' },
      ],
      messages: [
        { msg_id: 1, sender_id: 2, receiver_id: 1, ts: '2025-10-01 23:55:00', channel: 'Chat', text: 'Maya, do not publish the audit note.' },
        { msg_id: 2, sender_id: 1, receiver_id: 2, ts: '2025-10-01 23:56:00', channel: 'Chat', text: 'Noah, I will verify the sources.' },
      ],
      transactions: [
        { tx_id: 1, person_id: 6, vendor: 'CoffeeVend', amount: 2.50, ts: '2025-10-01 23:46:00', method: 'Cash', note: 'Espresso' },
        { tx_id: 7, person_id: 7, vendor: 'Supply', amount: 8.00, ts: '2025-10-02 00:02:00', method: 'Card', note: 'Sanitizer' },
      ],
      inventory: [
        { item_id: 1, name: 'Golden Trophy', room_id: 1, weight_kg: 2.00 },
        { item_id: 3, name: 'Maya Laptop', room_id: 1, weight_kg: 1.50 },
      ],
      evidence: [
        { evidence_id: 1, type: 'Physical', description: 'Trophy with blood marks', found_room_id: 1, ts_found: '2025-10-02 00:25:00' },
        { evidence_id: 3, type: 'Digital', description: 'CCTV clip missing 00:08-00:15', found_room_id: 15, ts_found: '2025-10-02 00:32:00' },
      ],
      alibis: [
        { alibi_id: 1, person_id: 2, statement_text: 'I was in Conference Hall from 00:05 to 00:30', submitted_ts: '2025-10-02 01:00:00' },
        { alibi_id: 2, person_id: 3, statement_text: 'I was patrolling the Lobby', submitted_ts: '2025-10-02 01:05:00' },
      ],
      cctv_gaps: [
        { gap_id: 1, room_id: 1, start_ts: '2025-10-02 00:08:00', end_ts: '2025-10-02 00:16:00', reason: 'Signal Loss' },
        { gap_id: 2, room_id: 2, start_ts: '2025-10-02 00:34:00', end_ts: '2025-10-02 00:42:00', reason: 'Maintenance' },
      ],
    };
    
    setTableData(tableDataMap[tableName] || []);
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
            <div className="flex items-center gap-3 mb-4">
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
            
            {/* Output Table */}
            {isCorrect && outputData.length > 0 && (
              <div className="mt-4 border-t border-primary/30 pt-4">
                <h4 className="text-sm font-semibold text-primary mb-2">QUERY OUTPUT:</h4>
                <div className="max-h-[300px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(outputData[0]).map((key) => (
                          <TableHead key={key} className="text-primary font-mono">{key}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {outputData.map((row, idx) => (
                        <TableRow key={idx}>
                          {Object.values(row).map((value: any, cellIdx) => (
                            <TableCell key={cellIdx} className="font-mono text-terminal-green">
                              {value === null ? 'NULL' : String(value)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
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
            {tableData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(tableData[0]).map((key) => (
                      <TableHead key={key} className="text-primary font-mono">{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, idx) => (
                    <TableRow key={idx}>
                      {Object.values(row).map((value: any, cellIdx) => (
                        <TableCell key={cellIdx} className="font-mono">
                          {value === null ? 'NULL' : String(value)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LevelPage;
