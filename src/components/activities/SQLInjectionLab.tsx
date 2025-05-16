"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle, Terminal, ExternalLink, Shield, RefreshCcw, ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface UserRecord {
  id: number;
  username: string;
  email: string;
  role: string;
  password?: string;
}

interface SQLInjectionLabProps {
  activity: any;
  userId: string;
  progress: any;
}

export default function SQLInjectionLab({ activity, userId, progress }: SQLInjectionLabProps) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(progress?.isCompleted || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("instructions");
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState<Record<string, boolean>>({});
  const [visibleSolutions, setVisibleSolutions] = useState<Record<string, boolean>>({});

  // Simulated database records
  const userRecords: UserRecord[] = [
    { id: 1, username: "admin", email: "admin@company.com", role: "admin", password: "adminpass" },
    { id: 2, username: "john", email: "john@company.com", role: "user", password: "johnpass" },
    { id: 3, username: "sarah", email: "sarah@company.com", role: "user", password: "sarahpass" },
    { id: 4, username: "alice", email: "alice@company.com", role: "manager", password: "alicepass" },
    { id: 5, username: "bob", email: "bob@company.com", role: "user", password: "bobpass" },
  ];

  // Extracted content
  const content = typeof activity.content === 'string'
    ? JSON.parse(activity.content)
    : activity.content;
  const scenarios = content.scenarios || [];
  
  // Navigation helpers
  const scenario = scenarios[currentScenarioIndex];
  const isFirst = currentScenarioIndex === 0;
  const isLast = currentScenarioIndex === scenarios.length - 1;
  const allComplete = scenarios.length > 0 && scenarios.every((s: {id: string}) => completedScenarios[s.id]);

  // Function to go to next scenario only if current is complete
  const goToNextScenario = () => {
    if (scenario && completedScenarios[scenario.id] && !isLast) {
      setCurrentScenarioIndex(i => i + 1);
    } else if (scenario && !completedScenarios[scenario.id]) {
      toast.error("Complete this scenario before continuing");
    }
  };

  // Solution toggle
  const toggleSolution = (scenarioId: string) => {
    setVisibleSolutions(prev => ({ ...prev, [scenarioId]: !prev[scenarioId] }));
  };

  // --- Scenario 1: Authentication Bypass ---
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginResult, setLoginResult] = useState<string | null>(null);

  function handleAuthBypass() {
    // Simulate vulnerable SQL: SELECT * FROM users WHERE username = '[USERNAME]' AND password = '[PASSWORD]'
    const inputUser = loginUsername;
    const inputPass = loginPassword;
    // Check for SQLi patterns
    if (
      /('|--|or|1=1|\badmin\b)/i.test(inputUser) ||
      /('|--|or|1=1)/i.test(inputPass)
    ) {
      setLoginResult("Authentication bypassed! All users returned.");
      if (scenario) {
        setCompletedScenarios(prev => ({ ...prev, [scenario.id]: true }));
      }
      toast.success("Authentication Bypass scenario completed!");
    } else {
      // Normal login
      const user = userRecords.find(u => u.username === inputUser && u.password === inputPass);
      if (user) {
        setLoginResult(`Welcome, ${user.username}!`);
      } else {
        setLoginResult("Login failed.");
      }
    }
  }

  // --- Scenario 2: Data Extraction ---
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<UserRecord[]>([]);
  const [searchResultMsg, setSearchResultMsg] = useState<string | null>(null);

  function handleDataExtraction() {
    // Simulate vulnerable SQL: SELECT id, name, description, price FROM products WHERE name LIKE '%[INPUT_SEARCH]%' OR description LIKE '%[INPUT_SEARCH]%'
    const input = searchInput;
    // Check for UNION SELECT pattern
    if (/union\s+select/i.test(input)) {
      setSearchResults(userRecords);
      setSearchResultMsg("Data extraction successful! User data exposed.");
      if (scenario) {
        setCompletedScenarios(prev => ({ ...prev, [scenario.id]: true }));
      }
      toast.success("Data Extraction scenario completed!");
    } else {
      setSearchResults([]);
      setSearchResultMsg("No results found or input not vulnerable.");
    }
  }

  // --- Scenario 3: Blind SQL Injection ---
  const [profileId, setProfileId] = useState("");
  const [blindResult, setBlindResult] = useState<string | null>(null);

  function handleBlindSQLi() {
    // Simulate: SELECT * FROM users WHERE id = [INPUT_ID]
    const input = profileId;
    // Check for boolean-based or time-based SQLi
    if (/and\s+1=1|substring|sleep|or\s+1=1/i.test(input)) {
      setBlindResult("Blind SQL Injection successful! Data can be extracted.");
      if (scenario) {
        setCompletedScenarios(prev => ({ ...prev, [scenario.id]: true }));
      }
      toast.success("Blind SQL Injection scenario completed!");
    } else {
      // Normal profile lookup
      const user = userRecords.find(u => u.id === Number(input));
      if (user) {
        setBlindResult(`Profile: ${user.username} (${user.email})`);
      } else {
        setBlindResult("User not found.");
      }
    }
  }

  // --- Submit Lab ---
  const handleSubmitLab = async () => {
    if (!allComplete) {
      toast.error("Please complete all scenarios before submitting");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/activities/${activity.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          activityId: activity.id,
          isCompleted: true,
          pointsEarned: activity.points,
        }),
      });
      if (response.ok) {
        setIsCompleted(true);
        toast.success("Lab completed successfully!");
        router.refresh();
      } else {
        toast.error("Failed to submit lab progress");
      }
    } catch (error) {
      toast.error("An error occurred while submitting");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render scenario UI ---
  function renderScenario() {
    if (!scenario) return null;
    if (scenario.id === "login-bypass") {
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{scenario.name}</CardTitle>
            <CardDescription>{scenario.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Username</Label>
            <Input value={loginUsername} onChange={e => setLoginUsername(e.target.value)} placeholder="e.g. admin or ' OR '1'='1" />
            <Label>Password</Label>
            <Input value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="any password" type="password" />
            <Button onClick={handleAuthBypass} className="mt-2 flex gap-2 items-center"><Terminal className="h-4 w-4" />Login</Button>
            {loginResult && <div className="mt-2 text-white/90">{loginResult}</div>}
          </CardContent>
        </Card>
      );
    }
    if (scenario.id === "data-extraction") {
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{scenario.name}</CardTitle>
            <CardDescription>{scenario.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Search Products</Label>
            <Input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Try a UNION SELECT injection..." />
            <Button onClick={handleDataExtraction} className="mt-2 flex gap-2 items-center"><Terminal className="h-4 w-4" />Search</Button>
            {searchResultMsg && <div className="mt-2 text-white/90">{searchResultMsg}</div>}
            {searchResults.length > 0 && (
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Username</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map(user => (
                      <tr key={user.id} className="border-t">
                        <td className="px-4 py-2">{user.id}</td>
                        <td className="px-4 py-2">{user.username}</td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">
                          <Badge variant={user.role === 'admin' ? "destructive" : "secondary"}>{user.role}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }
    if (scenario.id === "blind-injection") {
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{scenario.name}</CardTitle>
            <CardDescription>{scenario.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Profile ID</Label>
            <Input value={profileId} onChange={e => setProfileId(e.target.value)} placeholder="Try a boolean/time-based injection..." />
            <Button onClick={handleBlindSQLi} className="mt-2 flex gap-2 items-center"><Terminal className="h-4 w-4" />Lookup</Button>
            {blindResult && <div className="mt-2 text-white/90">{blindResult}</div>}
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{content.title || "SQL Injection Lab"}</h2>
          <p className="text-muted-foreground">{content.description || "Practice identifying and exploiting SQL injection vulnerabilities"}</p>
        </div>
        {isCompleted && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 px-3 py-1">
            <CheckCircle className="h-4 w-4" /> Completed
          </Badge>
        )}
      </div>
      <Tabs defaultValue="instructions" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="lab">SQL Injection Lab</TabsTrigger>
          <TabsTrigger value="solutions">Solutions</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="instructions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lab Instructions</CardTitle>
              <CardDescription>Learn how SQL injection works and how to prevent it</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.instructions || "" }} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Setup Guide</CardTitle>
              <CardDescription>How to use the SQL injection lab environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.setupGuide || "" }} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="lab" className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-semibold">Scenario {currentScenarioIndex + 1} of {scenarios.length}:</span> <span>{scenario?.name}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentScenarioIndex(i => i - 1)} disabled={isFirst}>
                <ArrowLeft className="h-4 w-4 mr-1" />Prev
              </Button>
                <Button
                variant="outline" 
                  size="sm"
                onClick={goToNextScenario} 
                disabled={isLast || (scenario && !completedScenarios[scenario.id])}
                className={
                  scenario && completedScenarios[scenario.id] && !isLast 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : ""
                }
              >
                Next<ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
          {renderScenario()}
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              {scenarios.map((s: {id: string}, idx: number) => (
                <Badge key={s.id} variant={completedScenarios[s.id] ? "default" : "secondary"} className={completedScenarios[s.id] ? "bg-green-500 text-white" : ""}>
                  {`Scenario ${idx + 1}`}
                  {completedScenarios[s.id] && <CheckCircle className="h-4 w-4 ml-1" />}
                                </Badge>
                          ))}
                    </div>
            <Button 
              onClick={handleSubmitLab} 
              disabled={isSubmitting || isCompleted || !allComplete}
              className="flex items-center gap-2"
              variant="default"
            >
              {isSubmitting ? "Submitting..." : isCompleted ? "Completed" : "Submit Lab"}
              {isCompleted && <CheckCircle className="h-4 w-4" />}
            </Button>
              </div>
        </TabsContent>
        <TabsContent value="solutions" className="space-y-4">
          {scenarios.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Challenge Solutions</CardTitle>
                <CardDescription>Detailed solutions for each SQL injection challenge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {scenarios.map((scenario: any) => (
                  <div key={scenario.id} className="space-y-4 border-b pb-6 mb-6 last:border-0">
                    <div>
                      <h3 className="font-semibold text-lg">{scenario.name}</h3>
                      <p className="text-white/85">{scenario.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Vulnerable Query</h4>
                      <div className="bg-slate-950 text-slate-50 p-3 rounded font-mono text-sm mb-4 overflow-x-auto">{scenario.sqlQuery}</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Solution</h4>
                        <Button variant="outline" size="sm" onClick={() => toggleSolution(scenario.id)} className="h-7 px-3 text-xs">{visibleSolutions[scenario.id] ? "Hide" : "Show Solution"}</Button>
                      </div>
                      {visibleSolutions[scenario.id] && scenario.solution ? (
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md border">
                          <div dangerouslySetInnerHTML={{ __html: scenario.solution }} />
                        </div>
                      ) : (
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md border text-white/85">Click the "Show Solution" button to view the detailed solution.</div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Solutions Available</CardTitle>
                <CardDescription>This lab doesn't have any specific scenario solutions defined</CardDescription>
              </CardHeader>
              <CardContent>
                <p>The solutions for this lab are not currently available. Please refer to the instructions and resources sections for guidance.</p>
              </CardContent>
            </Card>
          )}
          {content.summary && (
            <Card>
              <CardHeader>
                <CardTitle>Summary & Prevention Techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: content.summary }} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
              <CardDescription>Learn more about SQL injection and web security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {(content.resources || [
                  { name: "OWASP SQL Injection", url: "https://owasp.org/www-community/attacks/SQL_Injection" },
                  { name: "SQL Injection Cheat Sheet", url: "https://portswigger.net/web-security/sql-injection/cheat-sheet" },
                  { name: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" },
                  { name: "SQL Injection Prevention", url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" }
                ]).map((resource: { name: string; url: string }, index: number) => (
                  <a key={index} href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-md border hover:bg-muted transition-colors">
                    <div className="flex-1">{resource.name}</div>
                    <ExternalLink className="h-4 w-4 opacity-70" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 