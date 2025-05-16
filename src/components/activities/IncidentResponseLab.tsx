"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle, ShieldAlert, Files, Server, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface IncidentResponseLabProps {
  activity: any;
  userId: string;
  progress: any;
}

interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  level: string;
  message: string;
  relevance?: boolean;
}

interface ContainmentScenario {
  id: string;
  title: string;
  description: string;
  options: string[];
  correctAction: string;
  solution: string;
}

interface PlaybookStep {
  id: string;
  action: string;
}

interface Playbook {
  id: string;
  title: string;
  description: string;
  steps: PlaybookStep[];
  correctOrder: string[];
}

// Default data to use if content is missing or malformed
const defaultLogs: LogEntry[] = [
  {
    id: "log1",
    timestamp: "2023-07-15 08:23:15",
    source: "auth.log",
    level: "WARNING",
    message: "Failed login attempt for admin from IP 192.168.1.45",
    relevance: true
  },
  {
    id: "log2",
    timestamp: "2023-07-15 08:23:55",
    source: "auth.log",
    level: "INFO",
    message: "Successful login for admin from IP 192.168.1.45"
  },
  {
    id: "log3",
    timestamp: "2023-07-15 08:24:30",
    source: "system.log",
    level: "CRITICAL",
    message: "Unexpected privilege escalation for user admin",
    relevance: true
  }
];

const defaultContainmentScenarios: ContainmentScenario[] = [
  {
    id: "scenario1",
    title: "Ransomware Outbreak",
    description: "Multiple systems on the corporate network have been encrypted by ransomware. Users report seeing ransom notes on their screens.",
    options: [
      "Pay the ransom immediately to restore access",
      "Isolate affected systems by disconnecting them from the network",
      "Run anti-malware scan while systems remain online",
      "Immediately restore from backups without containing the threat"
    ],
    correctAction: "Isolate affected systems by disconnecting them from the network",
    solution: "Isolating affected systems is the first step in containment to prevent further spread of ransomware. After isolation, the encrypted data can be recovered from recent backups if available."
  },
  {
    id: "scenario2",
    title: "Data Exfiltration Detection",
    description: "Monitoring systems have detected unusual outbound data transfers to an unknown IP address originating from a server containing sensitive data.",
    options: [
      "Block the suspicious IP address only",
      "Shut down the affected server immediately",
      "Monitor the connection to gather more information without taking action",
      "Isolate the server and block all outbound connections while maintaining services"
    ],
    correctAction: "Isolate the server and block all outbound connections while maintaining services",
    solution: "Immediate isolation prevents further data exfiltration while maintaining critical services. This balanced approach allows for investigation while stopping the immediate threat."
  }
];

const defaultPlaybooks: Playbook[] = [
  {
    id: "playbook1",
    title: "Data Breach Response",
    description: "Organize the steps for responding to a data breach in the correct order.",
    steps: [
      {
        id: "step1",
        action: "Identify and contain the breach"
      },
      {
        id: "step2",
        action: "Assemble the incident response team"
      },
      {
        id: "step3",
        action: "Document the breach and collect evidence"
      },
      {
        id: "step4",
        action: "Conduct a preliminary assessment"
      },
      {
        id: "step5",
        action: "Notify affected parties and authorities"
      },
      {
        id: "step6",
        action: "Analyze root cause and implement remediation"
      }
    ],
    correctOrder: ["step2", "step4", "step1", "step3", "step5", "step6"]
  },
  {
    id: "playbook2",
    title: "Malware Incident Response",
    description: "Order the steps for responding to a malware infection on a critical system.",
    steps: [
      {
        id: "step1",
        action: "Isolate the infected system from the network"
      },
      {
        id: "step2",
        action: "Identify malware type and entry point"
      },
      {
        id: "step3",
        action: "Create forensic images of infected systems"
      },
      {
        id: "step4",
        action: "Scan other systems for similar infections"
      },
      {
        id: "step5",
        action: "Remove malware and restore system from clean backup"
      },
      {
        id: "step6",
        action: "Implement preventive measures to avoid reinfection"
      }
    ],
    correctOrder: ["step1", "step3", "step2", "step4", "step5", "step6"]
  }
];

export default function IncidentResponseLab({ activity, userId, progress }: IncidentResponseLabProps) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(progress?.isCompleted || false);
  const [activeTab, setActiveTab] = useState("logs");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState<Record<string, boolean>>({});
  const [playbookSteps, setPlaybookSteps] = useState<Record<string, string[]>>({});
  const [containmentActions, setContainmentActions] = useState<Record<string, string>>({});
  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  // Parse content safely
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [containmentScenarios, setContainmentScenarios] = useState<ContainmentScenario[]>([]);

  // Initialize content data
  useEffect(() => {
    try {
      let parsedContent;
      if (typeof activity.content === 'string') {
        try {
          parsedContent = JSON.parse(activity.content);
        } catch (e) {
          console.error("Failed to parse activity content:", e);
          parsedContent = {};
        }
      } else {
        parsedContent = activity.content || {};
      }

      // Use provided content or fall back to defaults
      const logsData = parsedContent?.logs && parsedContent.logs.length > 0 
        ? parsedContent.logs 
        : defaultLogs;
      
      const playbooksData = parsedContent?.playbooks && parsedContent.playbooks.length > 0 
        ? parsedContent.playbooks 
        : defaultPlaybooks;
      
      const scenariosData = parsedContent?.containmentScenarios && parsedContent.containmentScenarios.length > 0 
        ? parsedContent.containmentScenarios 
        : defaultContainmentScenarios;

      setLogs(logsData);
      setPlaybooks(playbooksData);
      setContainmentScenarios(scenariosData);

      // Initialize playbook steps order
      const initialPlaybookSteps: Record<string, string[]> = {};
      playbooksData.forEach((playbook: Playbook) => {
        if (!playbookSteps[playbook.id]) {
          // Create a randomized initial order of steps
          const initialSteps = [...(playbook.steps || []).map((step: PlaybookStep) => step.id)];
          
          // Shuffle the array
          for (let i = initialSteps.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [initialSteps[i], initialSteps[j]] = [initialSteps[j], initialSteps[i]];
          }
          
          initialPlaybookSteps[playbook.id] = initialSteps;
        }
      });
      
      if (Object.keys(initialPlaybookSteps).length > 0) {
        setPlaybookSteps(prev => ({
          ...prev,
          ...initialPlaybookSteps
        }));
      }
    } catch (error) {
      console.error("Error initializing lab content:", error);
      
      // Set defaults if there's an error
      setLogs(defaultLogs);
      setPlaybooks(defaultPlaybooks);
      setContainmentScenarios(defaultContainmentScenarios);
    }
  }, [activity.content, playbookSteps]);

  const handleToggleSolution = (id: string) => {
    setShowSolutions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleLogSelection = (logId: string, selected: boolean) => {
    setSelectedLogs(prev => ({
      ...prev,
      [logId]: selected
    }));
  };

  const handleContainmentAction = (scenarioId: string, action: string) => {
    setContainmentActions(prev => ({
      ...prev,
      [scenarioId]: action
    }));
  };

  const handlePlaybookDragEnd = (result: any, playbookId: string) => {
    if (!result.destination) return;
    
    const items = Array.from(playbookSteps[playbookId] || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setPlaybookSteps(prev => ({
      ...prev,
      [playbookId]: items
    }));
  };

  const calculateScore = () => {
    let total = 0;
    let earned = 0;

    // Log analysis (40% of total)
    const logWeight = 0.4;
    const relevantLogs = logs.filter(log => log.relevance);
    const relevantLogIds = new Set(relevantLogs.map(log => log.id));
    
    // Points for correctly selected logs
    Object.entries(selectedLogs).forEach(([logId, selected]) => {
      if (selected && relevantLogIds.has(logId)) {
        earned += 1;
      } else if (selected && !relevantLogIds.has(logId)) {
        earned -= 0.5; // Penalty for incorrectly selected logs
      }
    });

    // Normalize score to be between 0 and relevantLogs.length
    earned = Math.max(0, earned);
    const logScore = relevantLogs.length > 0 
      ? (earned / relevantLogs.length) * logWeight * 100 
      : 0;

    // Playbook ordering (30% of total)
    const playbookWeight = 0.3;
    let playbookScore = 0;
    let totalPlaybooks = playbooks.length;
    
    if (totalPlaybooks > 0) {
      let playbookPoints = 0;
      
      playbooks.forEach(playbook => {
        const userStepOrder = playbookSteps[playbook.id] || [];
        const correctOrder = playbook.correctOrder;
        
        // Count how many steps are in the correct position
        let correctPositions = 0;
        userStepOrder.forEach((stepId, index) => {
          if (index < correctOrder.length && stepId === correctOrder[index]) {
            correctPositions++;
          }
        });
        
        playbookPoints += correctOrder.length > 0 
          ? correctPositions / correctOrder.length 
          : 0;
      });
      
      playbookScore = (playbookPoints / totalPlaybooks) * playbookWeight * 100;
    }

    // Containment actions (30% of total)
    const containmentWeight = 0.3;
    let containmentScore = 0;
    
    if (containmentScenarios.length > 0) {
      let correctContainments = 0;
      
      containmentScenarios.forEach(scenario => {
        if (containmentActions[scenario.id] === scenario.correctAction) {
          correctContainments++;
        }
      });
      
      containmentScore = (correctContainments / containmentScenarios.length) * containmentWeight * 100;
    }

    // Total score
    const totalScore = Math.round(logScore + playbookScore + containmentScore);

    return {
      totalScore,
      logScore: Math.round(logScore / logWeight),
      playbookScore: Math.round(playbookScore / playbookWeight),
      containmentScore: Math.round(containmentScore / containmentWeight)
    };
  };

  const handleSubmitLab = async () => {
    try {
      setIsSubmitting(true);

      const scoreResults = calculateScore();
      setScore(scoreResults.totalScore);

      // Success threshold (70%)
      const passed = scoreResults.totalScore >= 70;

      // Prepare answers for submission
      const submissionData = {
        selectedLogs,
        playbookSteps,
        containmentActions
      };

      // Calculate points earned based on score percentage and total possible points
      const pointsEarned = Math.round((scoreResults.totalScore / 100) * activity.points);

      const payload = {
        isCompleted: passed,
        score: scoreResults.totalScore,
        pointsEarned,
        answers: submissionData
      };

      // Update activity progress in the database
      const response = await fetch(`/api/activities/${activity.id}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      setIsCompleted(passed);
      setShowResults(true);

      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error("Error submitting lab:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render results view
  if (showResults) {
    const scoreResults = calculateScore();
    
    return (
      <div className="space-y-6">
        <div className="text-center p-4">
          <div className="mb-4">
            {scoreResults.totalScore >= 70 ? (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            ) : (
              <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Lab Results</h2>
          <p className="text-gray-400 mb-4">
            {scoreResults.totalScore >= 70 
              ? "Congratulations! You've successfully completed the Incident Response Lab." 
              : "You need a score of at least 70% to pass this lab. Review the material and try again."}
          </p>
          
          <div className="text-2xl font-bold mb-6">
            Total Score: {scoreResults.totalScore}%
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Card className="bg-black/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Log Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{scoreResults.logScore}%</div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Playbook Ordering</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{scoreResults.playbookScore}%</div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Containment Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{scoreResults.containmentScore}%</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center space-x-4 mt-8">
            <Button onClick={() => setShowResults(false)} variant="outline">
              Review Exercises
            </Button>
            <Button asChild>
              <a href={`/levels/${activity.levelId}`}>
                Return to Level
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // If already completed and not showing results, show the completed state
  if (isCompleted && !showResults) {
    return (
      <div className="text-center py-6">
        <div className="mb-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Lab Completed</h2>
        <p className="text-gray-400 mb-6">You've successfully completed this lab.</p>
        
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => setIsCompleted(false)}>
            Review Lab
          </Button>
          <Button asChild>
            <a href={`/levels/${activity.levelId}`}>
              Return to Level
            </a>
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state if content isn't loaded yet
  if (logs.length === 0 && playbooks.length === 0 && containmentScenarios.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse h-8 w-48 bg-gray-700 rounded mx-auto mb-4"></div>
        <div className="animate-pulse h-4 w-64 bg-gray-800 rounded mx-auto mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse h-32 bg-black/30 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Incident Response Lab</h2>
        <p className="text-gray-400 mt-1">Practice incident response procedures and decision-making in a simulated security breach scenario.</p>
      </div>

      <Tabs defaultValue="logs" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Files className="h-4 w-4" /> Log Analysis
          </TabsTrigger>
          <TabsTrigger value="containment" className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Breach Containment
          </TabsTrigger>
          <TabsTrigger value="playbook" className="flex items-center gap-2">
            <Server className="h-4 w-4" /> IR Playbook
          </TabsTrigger>
        </TabsList>

        {/* Log Analysis Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card className="bg-black/30">
            <CardHeader>
              <CardTitle>Log Analysis</CardTitle>
              <CardDescription>
                Analyze system logs to identify signs of a security breach.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 space-y-4">
                <p className="mb-4">Review the following logs and select entries that indicate suspicious activity.</p>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Select</TableHead>
                      <TableHead className="w-48">Timestamp</TableHead>
                      <TableHead className="w-32">Source</TableHead>
                      <TableHead className="w-24">Level</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs && logs.length > 0 ? (
                      logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={!!selectedLogs[log.id]}
                              onChange={(e) => handleLogSelection(log.id, e.target.checked)}
                              className="w-4 h-4"
                            />
                          </TableCell>
                          <TableCell>{log.timestamp}</TableCell>
                          <TableCell>{log.source}</TableCell>
                          <TableCell>
                            <Badge variant={
                              log.level === "CRITICAL" ? "destructive" : 
                              log.level === "ERROR" ? "destructive" : 
                              log.level === "WARNING" ? "default" : "outline"
                            }>
                              {log.level}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{log.message}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <AlertTriangle className="h-8 w-8 text-yellow-500" />
                            <p>Loading log data...</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                
                <Button 
                  variant="link" 
                  onClick={() => handleToggleSolution("logs")}
                  className="p-0 h-auto font-normal text-blue-400"
                >
                  {showSolutions["logs"] ? "Hide Solution" : "Show Solution"}
                </Button>
                
                {showSolutions["logs"] && (
                  <div className="mt-2 p-4 bg-black/40 rounded-md">
                    <h3 className="font-medium text-lg mb-2">Log Analysis Solution</h3>
                    <p className="mb-2">The following log entries indicate suspicious activity:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {logs.filter(log => log.relevance).map(log => (
                        <li key={log.id} className="text-sm">
                          <span className="font-medium">{log.timestamp}</span> - {log.message}
                          <p className="text-xs text-gray-400 mt-1">
                            This is suspicious because it shows signs of unauthorized access or unusual activity.
                          </p>
                        </li>
                      ))}
                    </ul>
                    
                    <p className="mt-4 mb-2 font-medium">Analysis tips:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Look for failed login attempts followed by successful ones (potential brute force)</li>
                      <li>Identify unusual access times or locations</li>
                      <li>Check for privilege escalation activities</li>
                      <li>Monitor for data exfiltration patterns</li>
                      <li>Watch for unusual process executions or service creations</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Containment Tab */}
        <TabsContent value="containment" className="space-y-6">
          <Card className="bg-black/30">
            <CardHeader>
              <CardTitle>Breach Containment</CardTitle>
              <CardDescription>
                Select the appropriate containment strategies for each scenario.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {containmentScenarios.length > 0 ? (
                  containmentScenarios.map((scenario) => (
                    <div key={scenario.id} className="p-4 bg-black/20 rounded-md">
                      <h3 className="text-lg font-medium mb-2">{scenario.title}</h3>
                      <p className="mb-4">{scenario.description}</p>
                      
                      <RadioGroup
                        value={containmentActions[scenario.id] || ""}
                        onValueChange={(value) => handleContainmentAction(scenario.id, value)}
                      >
                        {scenario.options.map((option, index) => (
                          <div key={`option-${index}`} className="flex items-start space-x-2 mt-3">
                            <RadioGroupItem id={`option-${scenario.id}-${index}`} value={option} />
                            <Label htmlFor={`option-${scenario.id}-${index}`} className="text-sm">{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                      
                      <Button 
                        variant="link" 
                        onClick={() => handleToggleSolution(scenario.id)}
                        className="p-0 h-auto font-normal text-blue-400 mt-4"
                      >
                        {showSolutions[scenario.id] ? "Hide Solution" : "Show Solution"}
                      </Button>
                      
                      {showSolutions[scenario.id] && (
                        <div className="mt-2 p-4 bg-black/40 rounded-md">
                          <h4 className="font-medium mb-2">Correct Containment Approach:</h4>
                          <p className="text-sm">{scenario.solution}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                    <p>No containment scenarios available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Playbook Tab */}
        <TabsContent value="playbook" className="space-y-6">
          <Card className="bg-black/30">
            <CardHeader>
              <CardTitle>IR Playbook Development</CardTitle>
              <CardDescription>
                Arrange the steps in correct order to create effective incident response playbooks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {playbooks.length > 0 ? (
                  playbooks.map((playbook) => (
                    <div key={playbook.id} className="p-4 bg-black/20 rounded-md">
                      <h3 className="text-lg font-medium mb-2">{playbook.title}</h3>
                      <p className="mb-4">{playbook.description}</p>
                      
                      <DragDropContext onDragEnd={(result) => handlePlaybookDragEnd(result, playbook.id)}>
                        <Droppable droppableId={`playbook-${playbook.id}`}>
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-2"
                            >
                              {(playbookSteps[playbook.id] || []).map((stepId, index) => {
                                const step = playbook.steps.find(s => s.id === stepId);
                                return step ? (
                                  <Draggable key={step.id} draggableId={step.id} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="flex items-center p-3 bg-gray-800 rounded border border-gray-700 cursor-move"
                                      >
                                        <span className="mr-2 text-sm font-mono">{index + 1}.</span>
                                        <p className="text-sm">{step.action}</p>
                                      </div>
                                    )}
                                  </Draggable>
                                ) : null;
                              })}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                      
                      <Button 
                        variant="link" 
                        onClick={() => handleToggleSolution(playbook.id)}
                        className="p-0 h-auto font-normal text-blue-400 mt-4"
                      >
                        {showSolutions[playbook.id] ? "Hide Solution" : "Show Solution"}
                      </Button>
                      
                      {showSolutions[playbook.id] && (
                        <div className="mt-2 p-4 bg-black/40 rounded-md">
                          <h4 className="font-medium mb-2">Correct Playbook Order:</h4>
                          <ol className="list-decimal pl-5 space-y-1">
                            {playbook.correctOrder.map((stepId) => {
                              const step = playbook.steps.find(s => s.id === stepId);
                              return step ? (
                                <li key={stepId} className="text-sm">{step.action}</li>
                              ) : null;
                            })}
                          </ol>
                          
                          <p className="mt-4 text-sm">
                            Following this sequence ensures a structured response with proper evidence preservation,
                            effective containment, thorough eradication, and complete recovery while maintaining
                            proper documentation.
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                    <p>No playbooks available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-8">
        <Button onClick={handleSubmitLab} disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? "Submitting..." : "Submit Analysis"}
        </Button>
      </div>
    </div>
  );
} 