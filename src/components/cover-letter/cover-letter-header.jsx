import { useCoverLetter } from "./cover-letter-context";
import { Button } from "@/components/ui/button";
import { Download, Share } from "lucide-react";

export function CoverLetterHeader() {
  const { coverLetter } = useCoverLetter();

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([coverLetter.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${coverLetter.jobTitle}-cover-letter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${coverLetter.jobTitle} Cover Letter`,
          text: coverLetter.content,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {coverLetter.jobTitle}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </header>
  );
}
