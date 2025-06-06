import { useCoverLetter } from "./cover-letter-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function CoverLetterSidebar() {
  const { coverLetter } = useCoverLetter();

  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-50 p-4">
      <div className="space-y-4">
        <Link href="/ai-cover-letter">
          <Button variant="ghost" className="w-full justify-start">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cover Letters
          </Button>
        </Link>

        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">Cover Letter Details</h3>
          <div className="text-sm text-gray-600">
            <p>Company: {coverLetter.companyName}</p>
            <p>Job Title: {coverLetter.jobTitle}</p>
            <p>
              Created: {new Date(coverLetter.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">Your Information</h3>
          <div className="text-sm text-gray-600">
            <p>Name: {coverLetter.userName}</p>
            {coverLetter.userEmail && <p>Email: {coverLetter.userEmail}</p>}
          </div>
        </div>
      </div>
    </aside>
  );
}
