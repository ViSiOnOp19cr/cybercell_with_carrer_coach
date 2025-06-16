"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Lock } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Certificate {
  verificationCode: string;
  title: string;
  description: string;
  issueDate: Date;
  skills: string[];
}

interface DownloadCertificateButtonProps {
  totalPoints: number;
  userName: string;
  pointsRequired: number;
}

export default function DownloadCertificateButton({ 
  totalPoints, 
  userName,
  pointsRequired = 1500 
}: DownloadCertificateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateData, setCertificateData] = useState<Certificate | null>(null);
  
  const isUnlocked = totalPoints >= pointsRequired;
  
  const generateCertificate = async () => {
    try {
      setIsGenerating(true);
      
      // Call API to create certificate in database
      const response = await fetch("/api/certificates/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate certificate");
      }
      
      const data = await response.json();
      setCertificateData(data);
      return data; // Return the certificate data directly
      
      // Show success message
      toast.success("Certificate generated successfully!");
    } catch (error: any) {
      console.error("Error generating certificate:", error);
      toast.error(error.message || "Failed to generate certificate");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadCertificate = async () => {
    try {
      let certData = certificateData;
      
      // If we don't have certificate data, generate it
      if (!certData) {
        certData = await generateCertificate();
        if (!certData) {
          throw new Error("Failed to generate certificate data");
        }
      }
      
      // Create an iframe to isolate the certificate from the parent page styles
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '-9999px';
      iframe.style.width = '800px';
      iframe.style.height = '600px';
      document.body.appendChild(iframe);
      
      // Create the certificate element in the iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error("Could not access iframe document");
      
      // Create a container in the iframe
      const certificateContainer = iframeDoc.createElement('div');
      certificateContainer.style.position = 'absolute';
      certificateContainer.style.left = '0';
      certificateContainer.style.top = '0';
      certificateContainer.style.width = '800px';
      certificateContainer.style.height = '600px';
      certificateContainer.style.padding = '50px';
      certificateContainer.style.backgroundColor = 'rgb(102,178,255)';
      certificateContainer.style.borderRadius = '10px';
      certificateContainer.style.border = '1px solid rgb(102,178,255)';
      certificateContainer.style.boxShadow = '0 10px 20px rgb(102,178,255)';
      certificateContainer.style.fontFamily = 'Arial, sans-serif';
      certificateContainer.style.color = 'rgb(10,10,10)';
      
      // Add certificate content with only standard RGB colors
      certificateContainer.innerHTML = `
  <div style="max-width: 800px; margin: 0 auto; padding: 40px; background: linear-gradient(to bottom right, #e0f7ff, #ffffff); border-radius: 20px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); font-family: 'Segoe UI', sans-serif; position: relative;">
    
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: flex; align-items: center; justify-content: center;">
        <div style="background-color: #00c9a7; border-radius: 50%; padding: 12px; margin-right: 12px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <span style="font-size: 32px; font-weight: 600; color: #0f172a;">CyberQuest</span>
      </div>
    </div>

    <h1 style="text-align: center; font-size: 36px; color: #0f172a; margin-bottom: 10px;">Certificate of Achievement</h1>
    <h2 style="text-align: center; font-size: 24px; color: #0284c7; margin-bottom: 30px;">Cybersecurity Master Certificate</h2>

    <p style="text-align: center; font-size: 18px; color: #334155; margin-bottom: 10px;">This is to certify that</p>
    <p style="text-align: center; font-size: 30px; font-weight: bold; color: #0f172a; margin-bottom: 20px;">${userName}</p>

    <p style="text-align: center; font-size: 18px; color: #334155; line-height: 1.6; margin-bottom: 40px;">
      has successfully completed the comprehensive cybersecurity training program and demonstrated exceptional knowledge across multiple security domains.
    </p>

    <div style="display: flex; justify-content: space-between; padding: 0 20px; margin-top: 20px;">
      <div>
        <p style="font-size: 14px; color: #64748b; margin-bottom: 5px;">Date Issued</p>
        <p style="font-size: 16px; font-weight: bold; color: #0f172a;">
          ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      <div style="text-align: right;">
        <p style="font-size: 14px; color: #64748b; margin-bottom: 5px;">Certificate ID</p>
        <p style="font-size: 16px; font-weight: bold; color: #0f172a;">
          ${certData?.verificationCode || 'Generating...'}
        </p>
      </div>
    </div>

    <div style="position: absolute; bottom: 20px; left: 0; right: 0; text-align: center;">
    </div>
  </div>
`;

      
      
      iframeDoc.body.appendChild(certificateContainer);
      
      try {
        // Convert the certificate to canvas using standard RGB colors
        const canvas = await html2canvas(certificateContainer, {
          scale: 2,
          backgroundColor: '#141414',
          useCORS: true,
          allowTaint: true,
          logging: false,
          ignoreElements: (element) => {
            // Skip elements with OKLCH colors that would cause parsing errors
            return false;
          },
          onclone: (documentClone, element) => {
            // Remove any style sheets that might be cloned
            const styleLinks = documentClone.querySelectorAll('link[rel="stylesheet"]');
            styleLinks.forEach(link => link.remove());
            
            const styleElements = documentClone.querySelectorAll('style');
            styleElements.forEach(style => style.remove());
            
            return documentClone;
          }
        });
        
        // Create PDF from canvas
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgWidth = 297; // A4 landscape width
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`Cybersecurity_Certificate_${certData?.verificationCode.substring(0, 8)}.pdf`);
        
        toast.success("Certificate downloaded!");
      } finally {
        // Clean up - remove the iframe
        document.body.removeChild(iframe);
      }
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Failed to download certificate");
    }
  };
  
  return (
    <div className="mt-4">
      {isUnlocked ? (
        <Button 
          onClick={downloadCertificate} 
          style={{ backgroundColor: 'rgb(34, 197, 94)' }}
          className="w-full py-2.5 hover:bg-green-700 text-white"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>Generating...</>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Certificate
            </>
          )}
        </Button>
      ) : (
        <Button 
          disabled
          style={{ backgroundColor: 'rgb(63, 63, 70)' }}
          className="w-full py-2.5 cursor-not-allowed text-gray-300"
        >
          <Lock className="mr-2 h-4 w-4" />
          Unlock at {pointsRequired} Points ({pointsRequired - totalPoints} more needed)
        </Button>
      )}
    </div>
  );
} 