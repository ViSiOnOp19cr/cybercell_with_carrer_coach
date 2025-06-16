"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle, Terminal, ExternalLink, Shield, Lock, Smartphone, Mail, Key, Check, Fingerprint, Brain, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

interface MFADemoLabProps {
  activity: any;
  userId: string;
  progress: any;
}

export default function MFADemoLab({ activity, userId, progress }: MFADemoLabProps) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(progress?.isCompleted || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("instructions");
  
  // Lab-specific state
  const [factorType, setFactorType] = useState<"knowledge" | "possession" | "inherence">("knowledge");
  const [completedFactors, setCompletedFactors] = useState<string[]>([]);
  
  // Knowledge factor challenge
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [knowledgeVerified, setKnowledgeVerified] = useState(false);
  
  // Possession factor challenge
  const [totpCode, setTotpCode] = useState("");
  const [actualTotpCode, setActualTotpCode] = useState("");
  const [possessionVerified, setPossessionVerified] = useState(false);
  
  // Inherence factor challenge
  const [fingerprintMatch, setFingerprintMatch] = useState(0);
  const [inherenceVerified, setInherenceVerified] = useState(false);
  
  // Task tracking variables
  const [score, setScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  
  // Extracted content from activity
  const content = typeof activity.content === 'string'
    ? JSON.parse(activity.content)
    : activity.content;

  // Define MFA lab tasks
  const mfaTasks = content?.tasks || [
    {
      id: "knowledge-factor",
      title: "Knowledge Factor Authentication",
      description: "Complete the 'something you know' authentication challenge.",
      points: 20,
      hint: "Use the credentials provided in the instructions and correctly answer the security question."
    },
    {
      id: "possession-factor",
      title: "Possession Factor Authentication",
      description: "Complete the 'something you have' authentication challenge.",
      points: 20,
      hint: "Use the authenticator code that appears on the screen as if it were from an authenticator app."
    },
    {
      id: "inherence-factor",
      title: "Inherence Factor Authentication",
      description: "Complete the 'something you are' authentication challenge.",
      points: 30,
      hint: "Adjust the fingerprint match slider to simulate a biometric authentication."
    }
  ];

  // Load saved progress
  useEffect(() => {
    if (progress?.answers) {
      try {
        const savedAnswers = typeof progress.answers === 'string'
          ? JSON.parse(progress.answers)
          : progress.answers;
        
        if (savedAnswers.completedFactors) {
          setCompletedFactors(savedAnswers.completedFactors);
          
          if (savedAnswers.completedFactors.includes("knowledge")) {
            setKnowledgeVerified(true);
          }
          
          if (savedAnswers.completedFactors.includes("possession")) {
            setPossessionVerified(true);
          }
          
          if (savedAnswers.completedFactors.includes("inherence")) {
            setInherenceVerified(true);
          }
        }
        
        if (savedAnswers.completedTasks) {
          setCompletedTasks(savedAnswers.completedTasks);
        }
        
        if (savedAnswers.score) {
          setScore(savedAnswers.score);
        }
      } catch (error) {
        console.error("Error parsing saved answers:", error);
      }
    }
  }, [progress]);

  // Update completed tasks when authentication factors are completed
  useEffect(() => {
    const tasks: Record<string, boolean> = {};
    
    mfaTasks.forEach((task: any) => {
      if (task.id === "knowledge-factor" && completedFactors.includes("knowledge")) {
        tasks[task.id] = true;
      } else if (task.id === "possession-factor" && completedFactors.includes("possession")) {
        tasks[task.id] = true;
      } else if (task.id === "inherence-factor" && completedFactors.includes("inherence")) {
        tasks[task.id] = true;
      }
    });
    
    setCompletedTasks(tasks);
    
    // Calculate score based on completed tasks
    const newScore = mfaTasks
      .filter((task: any) => tasks[task.id])
      .reduce((total: any, task: any) => total + task.points, 0);
    
    setScore(newScore);
  }, [completedFactors]);

  // Generate a random 6-digit code for TOTP
  const generateTotpCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Start TOTP code generation and rotation
  useEffect(() => {
    if (factorType === "possession" && !possessionVerified) {
      // Generate initial code
      setActualTotpCode(generateTotpCode());
      
      // Set up timer to regenerate code every 30 seconds (simulating TOTP)
      const interval = setInterval(() => {
        setActualTotpCode(generateTotpCode());
        toast.info("Authenticator code refreshed!", { duration: 3000 });
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [factorType, possessionVerified]);

  // Toggle hint visibility
  const toggleHint = (taskId: string) => {
    setShowHints(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Calculate completion percentage
  const completionPercentage = (Object.keys(completedTasks).length / mfaTasks.length) * 100;

  // Check if all tasks are completed
  const allTasksCompleted = completedFactors.length >= 3;

  // Handle knowledge factor verification
  const handleKnowledgeVerification = () => {
    if (username === "securityuser" && password === "Secure123!" && 
        securityQuestion.toLowerCase().includes("new york")) {
      setKnowledgeVerified(true);
      toast.success("Knowledge factor verified successfully!");
      
      // Add to completed factors if not already done
      if (!completedFactors.includes("knowledge")) {
        setCompletedFactors([...completedFactors, "knowledge"]);
      }
    } else {
      toast.error("Verification failed. Check your credentials and answer.");
    }
  };

  // Handle possession factor verification
  const handlePossessionVerification = () => {
    if (totpCode === actualTotpCode) {
      setPossessionVerified(true);
      toast.success("Possession factor verified successfully!");
      
      // Add to completed factors if not already done
      if (!completedFactors.includes("possession")) {
        setCompletedFactors([...completedFactors, "possession"]);
      }
    } else {
      toast.error("Invalid code. Please try again.");
    }
  };

  // Handle inherence factor verification
  const handleInherenceVerification = () => {
    if (fingerprintMatch >= 90) {
      setInherenceVerified(true);
      toast.success("Inherence factor verified successfully!");
      
      // Add to completed factors if not already done
      if (!completedFactors.includes("inherence")) {
        setCompletedFactors([...completedFactors, "inherence"]);
      }
    } else {
      toast.error("Fingerprint match too low. Try again.");
    }
  };

  // Handle form submission
  const handleSubmitLab = async () => {
    try {
      // Only allow submission if user has completed all three authentication factors
      if (completedFactors.length < 3) {
        toast.error("You need to successfully complete all three authentication factor challenges to complete the lab");
        return;
      }

      setIsSubmitting(true);
      
      // Prepare submission data
      const submissionData = {
        completedFactors,
        completedTasks,
        score
      };

      // Calculate points earned based on score
      const pointsEarned = Math.round((score / (mfaTasks.reduce((sum: any, task: any) => sum + task.points, 0))) * activity.points);
      
      // Update activity progress in the database
      const response = await fetch(`/api/activities/${activity.id}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          activityId: activity.id,
          isCompleted: true,
          score,
          pointsEarned,
          answers: submissionData
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update progress");
      }
      
      setIsCompleted(true);
      setShowResults(true);
      setActiveTab(""); // Clear active tab to show the completion screen
      toast.success("Lab completed successfully!");
      
      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error("Error submitting lab:", error);
      toast.error("Failed to submit lab progress");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset the lab for reattempt
  const handleReattempt = async () => {
    try {
      setIsSubmitting(true);
      
      // Reset the progress on the server
      const response = await fetch(`/api/activities/${activity.id}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isCompleted: false,
          score: 0,
          pointsEarned: 0,
          answers: {}
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to reset progress");
      }
      
      // Reset all state to initial values
      setCompletedFactors([]);
      setCompletedTasks({});
      setScore(0);
      setShowHints({});
      setKnowledgeVerified(false);
      setPossessionVerified(false);
      setInherenceVerified(false);
      setActiveTab("lab");
      setIsCompleted(false);
      setUsername("");
      setPassword("");
      setSecurityQuestion("");
      setTotpCode("");
      setFingerprintMatch(0);
      
      // Refresh the page data
      router.refresh();
      toast.success("Lab has been reset. You can now try again!");
    } catch (error) {
      console.error("Error resetting lab:", error);
      toast.error("Failed to reset lab progress");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show completed state as a standalone page when not viewing tabs
  if (isCompleted && !activeTab) {
    return (
      <div className="text-center py-6">
        <div className="mb-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">Lab Completed</h2>
        <p className="text-white mb-6">You've successfully completed the Multi-Factor Authentication lab.</p>
        
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setActiveTab("lab");
            }}
          >
            Review Lab
          </Button>
          <Button variant="outline" onClick={handleReattempt}>
            Try Again
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{content?.title || "Multi-Factor Authentication Lab"}</h2>
          <p className="text-muted-foreground">
            {content?.description || "Learn about the three main types of authentication factors and how they work together."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 px-3 py-1">
              <CheckCircle className="h-4 w-4" />
              Completed
            </Badge>
          )}
          {isCompleted && (
            <Button variant="outline" size="sm" onClick={handleReattempt} className="h-8">
              Try Again
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="instructions" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="lab">Lab Environment</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="submit">Submit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="instructions" className="space-y-4">
          <div className="prose prose-invert max-w-none mb-6">
            <h2 className="text-2xl font-bold">Authentication Factors Lab</h2>
            <p>
              This lab explores the three main types of authentication factors that form the foundation of Multi-Factor Authentication (MFA):
            </p>
            <ul className="list-disc pl-5">
              <li><strong>Knowledge factors</strong>: Something you know (passwords, PINs, security questions)</li>
              <li><strong>Possession factors</strong>: Something you have (security tokens, smart cards, mobile devices)</li>
              <li><strong>Inherence factors</strong>: Something you are (biometrics like fingerprints, facial recognition)</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4">Objectives</h3>
            <ul className="list-disc pl-5">
              <li>Understand how each type of authentication factor works</li>
              <li>Experience the process of verifying each factor</li>
              <li>Learn why combining multiple factors creates stronger security</li>
              <li>Recognize the strengths and weaknesses of each factor type</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4">Lab Credentials</h3>
            <p>To complete the knowledge factor challenge, use these credentials:</p>
            <ul className="list-disc pl-5">
              <li>Username: <code className="bg-black/30 px-1 py-0.5 rounded">securityuser</code></li>
              <li>Password: <code className="bg-black/30 px-1 py-0.5 rounded">Secure123!</code></li>
              <li>Security question - "What city were you born in?": <code className="bg-black/30 px-1 py-0.5 rounded">New York</code></li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="lab" className="space-y-4">
          <div className="max-w-md mx-auto">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Authentication Factor Challenges</CardTitle>
                <CardDescription>
                  Complete all three authentication factor challenges to demonstrate your understanding of MFA.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={factorType} 
                  onValueChange={(value) => setFactorType(value as "knowledge" | "possession" | "inherence")}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="knowledge" id="knowledge" />
                    <Label htmlFor="knowledge" className="flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      Knowledge Factor (Something you know)
                      {completedFactors.includes("knowledge") && (
                        <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                      )}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="possession" id="possession" />
                    <Label htmlFor="possession" className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Possession Factor (Something you have)
                      {completedFactors.includes("possession") && (
                        <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                      )}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inherence" id="inherence" />
                    <Label htmlFor="inherence" className="flex items-center">
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Inherence Factor (Something you are)
                      {completedFactors.includes("inherence") && (
                        <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                      )}
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            {/* Knowledge Factor Challenge */}
            {factorType === "knowledge" && (
              <Card className="border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-blue-500" />
                    Knowledge Factor Challenge
                  </CardTitle>
                  <CardDescription>
                    Authenticate using information that you know
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!knowledgeVerified ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          placeholder="Enter username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="security-question">What city were you born in?</Label>
                        <Input
                          id="security-question"
                          placeholder="Enter your answer"
                          value={securityQuestion}
                          onChange={(e) => setSecurityQuestion(e.target.value)}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleKnowledgeVerification}
                        className="w-full"
                      >
                        Verify Knowledge Factor
                      </Button>
                      
                      <div className="bg-blue-900/20 p-3 rounded-md border border-blue-500/30">
                        <p className="text-sm">
                          <strong>Knowledge factors</strong> are something you know, like passwords, 
                          PINs, or answers to security questions. They're the most common but also 
                          the weakest form of authentication because they can be guessed, stolen, 
                          or shared.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-green-900/20 p-4 rounded-md border border-green-500/30">
                        <p className="flex items-center font-medium text-green-400">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Knowledge Factor Verified!
                        </p>
                        <p className="mt-2 text-sm">
                          You've successfully authenticated using information you know (username, 
                          password, and security question answer).
                        </p>
                      </div>
                      
                      <div className="bg-amber-900/20 p-3 rounded-md border border-amber-500/30">
                        <p className="text-sm font-medium text-amber-400">Security Considerations:</p>
                        <ul className="text-sm mt-2 list-disc pl-5 space-y-1">
                          <li>Passwords can be compromised through phishing, data breaches, or brute force attacks</li>
                          <li>Security questions often have answers that could be researched or guessed</li>
                          <li>Users tend to reuse passwords across multiple sites</li>
                          <li>Knowledge factors alone are no longer considered sufficient for high-security systems</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Possession Factor Challenge */}
            {factorType === "possession" && (
              <Card className="border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2 text-purple-500" />
                    Possession Factor Challenge
                  </CardTitle>
                  <CardDescription>
                    Authenticate using something you physically possess
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!possessionVerified ? (
                    <div className="space-y-4">
                      <div className="bg-black/30 p-4 rounded-md border border-gray-700 text-center">
                        <div className="text-sm mb-2">Your Authenticator App Code:</div>
                        <div className="font-mono text-2xl tracking-widest bg-black/50 py-3 rounded-md">
                          {actualTotpCode}
                        </div>
                        <div className="text-sm mt-2 text-gray-400">Code refreshes every 30 seconds</div>
                      </div>
                      
                      <div>
                        <Label htmlFor="totp-code">Enter the code from your authenticator</Label>
                        <Input
                          id="totp-code"
                          placeholder="6-digit code"
                          value={totpCode}
                          onChange={(e) => setTotpCode(e.target.value)}
                          className="tracking-widest text-center text-lg"
                          maxLength={6}
                        />
                      </div>
                      
                      <Button 
                        onClick={handlePossessionVerification}
                        className="w-full"
                        disabled={totpCode.length !== 6}
                      >
                        Verify Possession Factor
                      </Button>
                      
                      <div className="bg-purple-900/20 p-3 rounded-md border border-purple-500/30">
                        <p className="text-sm">
                          <strong>Possession factors</strong> are physical objects you own, like a 
                          mobile phone with an authenticator app, a hardware token, or a smart card. 
                          They're more secure than knowledge factors because an attacker would need 
                          to physically obtain the device.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-green-900/20 p-4 rounded-md border border-green-500/30">
                        <p className="flex items-center font-medium text-green-400">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Possession Factor Verified!
                        </p>
                        <p className="mt-2 text-sm">
                          You've successfully authenticated using a simulated Time-based One-Time Password (TOTP),
                          demonstrating the "something you have" factor.
                        </p>
                      </div>
                      
                      <div className="bg-blue-900/20 p-3 rounded-md border border-blue-500/30">
                        <p className="text-sm font-medium text-blue-400">How TOTP Works:</p>
                        <ol className="text-sm mt-2 list-decimal pl-5 space-y-1">
                          <li>A shared secret key is established between the server and authenticator app</li>
                          <li>The current time is used as an input (typically rounded to 30-second intervals)</li>
                          <li>A cryptographic algorithm combines the secret key and time to generate a code</li>
                          <li>The code changes regularly, making captured codes quickly useless</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Inherence Factor Challenge */}
            {factorType === "inherence" && (
              <Card className="border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Fingerprint className="h-5 w-5 mr-2 text-green-500" />
                    Inherence Factor Challenge
                  </CardTitle>
                  <CardDescription>
                    Authenticate using your biometric characteristics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!inherenceVerified ? (
                    <div className="space-y-4">
                      <div className="bg-black/30 p-4 rounded-md border border-gray-700">
                        <div className="text-center mb-3">Fingerprint Scanner</div>
                        <div className="relative">
                          <div className="w-full h-36 bg-black/50 rounded-md flex items-center justify-center border border-gray-700">
                            <Fingerprint className="h-20 w-20 text-gray-600" />
                          </div>
                          <div className={`absolute inset-0 bg-green-500/20 rounded-md flex items-center justify-center transition-opacity duration-300 ${fingerprintMatch > 0 ? 'opacity-' + Math.round(fingerprintMatch/10) : 'opacity-0'}`}>
                            <Fingerprint className="h-20 w-20 text-green-400" />
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Scan Quality</span>
                            <span className="text-sm font-medium">{fingerprintMatch}%</span>
                          </div>
                          <Slider
                            value={[fingerprintMatch]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(values) => setFingerprintMatch(values[0])}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-400 text-center mt-2">
                            Move the slider to simulate fingerprint scanning quality
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleInherenceVerification}
                        className="w-full"
                        disabled={fingerprintMatch < 50}
                      >
                        Verify Inherence Factor
                      </Button>
                      
                      <div className="bg-green-900/20 p-3 rounded-md border border-green-500/30">
                        <p className="text-sm">
                          <strong>Inherence factors</strong> are biological traits unique to you, 
                          like fingerprints, facial features, voice patterns, or retina scans. 
                          They're convenient (you always have them) and difficult to replicate, 
                          but they can't be changed if compromised.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-green-900/20 p-4 rounded-md border border-green-500/30">
                        <p className="flex items-center font-medium text-green-400">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Inherence Factor Verified!
                        </p>
                        <p className="mt-2 text-sm">
                          You've successfully authenticated using a simulated biometric fingerprint scan,
                          demonstrating the "something you are" factor.
                        </p>
                      </div>
                      
                      <div className="bg-amber-900/20 p-3 rounded-md border border-amber-500/30">
                        <p className="text-sm font-medium text-amber-400">Biometric Considerations:</p>
                        <ul className="text-sm mt-2 list-disc pl-5 space-y-1">
                          <li>Unlike passwords, biometrics cannot be changed if compromised</li>
                          <li>Biometric systems must consider false accept rates (FAR) and false reject rates (FRR)</li>
                          <li>Privacy concerns exist around the storage and protection of biometric data</li>
                          <li>Biometrics may not work for all users (accessibility concerns)</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          {completedFactors.length === 3 && (
            <Card className="mt-6 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-400">
                  <Shield className="h-5 w-5 mr-2" />
                  Multi-Factor Authentication Complete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-900/20 p-4 rounded-md border border-blue-500/30">
                  <p>
                    Congratulations! You've successfully completed authentication using all three types of factors:
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                      <div>
                        <strong>Knowledge factor:</strong> Username, password, and security question
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                      <div>
                        <strong>Possession factor:</strong> Time-based authenticator code
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                      <div>
                        <strong>Inherence factor:</strong> Biometric fingerprint scan
                      </div>
                    </li>
                  </ul>
                  
                  <p className="mt-4">
                    By combining multiple authentication factors, you've created a much stronger authentication system
                    than any single factor could provide on its own.
                  </p>
                  
                  <div className="mt-4">
                    <Button 
                      onClick={() => setActiveTab("submit")}
                      className="w-full"
                    >
                      Continue to Submission
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
              <CardDescription>Learn more about multi-factor authentication and access control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {(content?.resources || [
                  { name: "NIST Digital Identity Guidelines", url: "https://pages.nist.gov/800-63-3/" },
                  { name: "OWASP Authentication Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" },
                  { name: "Role-Based Access Control (RBAC) Design Guide", url: "https://csrc.nist.gov/publications/detail/conference-paper/2020/04/14/a-role-based-access-control-rbac-system-design-guide/draft" },
                  { name: "The Ultimate Guide to Biometric Authentication", url: "https://auth0.com/blog/biometric-authentication-a-comprehensive-guide/" }
                ]).map((resource: { name: string; url: string }, index: number) => (
                  <a 
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-md border hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">{resource.name}</div>
                    <ExternalLink className="h-4 w-4 opacity-70" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submit">
          <Card>
            <CardHeader>
              <CardTitle>Complete the Lab</CardTitle>
              <CardDescription>Submit your work to receive credit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Your Progress</h3>
                  <span className="text-sm font-medium">{completionPercentage.toFixed(0)}% Complete</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Lab Tasks</h3>
                <div className="space-y-3">
                  {mfaTasks.map((task: any) => (
                    <div key={task.id} className="flex flex-col p-3 border rounded-md">
                      <div className="flex items-start space-x-2">
                        <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                          completedTasks[task.id] ? 'bg-green-500 text-white' : 'bg-slate-200'
                        }`}>
                          {completedTasks[task.id] && <Check className="h-3 w-3" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className={`font-medium ${completedTasks[task.id] ? 'text-green-600' : ''}`}>
                              {task.title}
                            </h4>
                            <span className="text-sm">{task.points} pts</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          
                          {!completedTasks[task.id] && task.hint && (
                            <div className="mt-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => toggleHint(task.id)}
                                className="text-xs h-7 px-2"
                              >
                                {showHints[task.id] ? "Hide Hint" : "Show Hint"}
                              </Button>
                              
                              {showHints[task.id] && (
                                <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded text-sm text-amber-700">
                                  <span className="font-semibold">Hint:</span> {task.hint}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {showResults && (
                <div className="bg-green-50 border border-green-100 rounded-md p-4">
                  <h3 className="text-green-800 font-medium">Lab Completed!</h3>
                  <p className="text-green-700 mt-1">
                    You've earned {score} out of {mfaTasks.reduce((sum: any, task: any) => sum + task.points, 0)} points.
                  </p>
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-blue-800 mt-4">
                <p className="font-semibold">Key Takeaways:</p>
                <ul className="mt-2">
                  <li>Multi-factor authentication combines at least two different types of authentication factors.</li>
                  <li>The three main categories are: knowledge (something you know), possession (something you have), and inherence (something you are).</li>
                  <li>Each factor type has different strengths and weaknesses.</li>
                  <li>Using multiple factors significantly increases security by requiring an attacker to compromise multiple different systems.</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleSubmitLab}
                disabled={!allTasksCompleted || isSubmitting || isCompleted}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Submitting..." : isCompleted ? "Completed" : "Complete Lab"}
              </Button>
              {isCompleted && (
                <Button
                  onClick={handleReattempt}
                  variant="outline"
                  className="w-full sm:w-auto ml-2"
                >
                  Try Again
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 