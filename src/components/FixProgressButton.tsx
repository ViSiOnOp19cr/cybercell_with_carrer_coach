"use client";

import { useState } from "react";
import { RefreshCw, HelpCircle } from "lucide-react";

export default function FixProgressButton() {
  const [isFixing, setIsFixing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [result, setResult] = useState<null | { success: boolean; message: string; details?: any }>(null);
  
  const handleFixProgress = async () => {
    try {
      setIsFixing(true);
      setResult(null);
      
      const response = await fetch('/api/check-progress');
      const data = await response.json();
      
      if (data.success) {
        setResult({
          success: true,
          message: data.message || `Progress fixed! ${data.fixedIssues.length ? `Fixed ${data.fixedIssues.length} issues.` : 'No issues found.'}`,
          details: data.levelProgressUpdated ? 'Level progression has been updated!' : null
        });
        
        // Reload the page after a short delay if issues were fixed
        if (data.fixedIssues.length > 0 || data.levelProgressUpdated) {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to fix progress.'
        });
      }
    } catch (error) {
      console.error('Error fixing progress:', error);
      setResult({
        success: false,
        message: 'An error occurred. Please try again.'
      });
    } finally {
      setIsFixing(false);
    }
  };
  
  return (
    <div className="relative">
      <div className="flex items-center space-x-1">
        <button
          onClick={handleFixProgress}
          disabled={isFixing}
          className="text-xs bg-black/30 border border-green-500/30 hover:bg-black/50 px-3 py-2 rounded-md flex items-center text-white/85"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isFixing ? 'animate-spin' : ''}`} />
          {isFixing ? 'Fixing...' : 'Fix Progress'}
        </button>
        
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-white/60 hover:text-white/80"
        >
          <HelpCircle className="h-3 w-3" />
        </button>
      </div>
      
      {showHelp && (
        <div className="absolute top-8 right-0 z-10 bg-black/90 border border-green-500/30 rounded-md p-3 text-xs text-white/85 w-64">
          <div className="font-medium text-green-400 mb-1">What does this do?</div>
          <p className="mb-2">
            Fixes common progression issues, especially if you completed Level 2 activities but Level 3 didn't unlock.
          </p>
          <p className="text-white/70">
            We recently updated Level 2 requirements from 100% to 70% completion. Click this to recalculate your progress.
          </p>
        </div>
      )}
      
      {result && (
        <div className={`text-xs mt-1 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
          {result.message}
          {result.details && (
            <div className="text-green-300 font-medium mt-1">{result.details}</div>
          )}
        </div>
      )}
    </div>
  );
} 