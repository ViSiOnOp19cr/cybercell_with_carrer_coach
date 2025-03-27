import { getCoverLetters } from "../../../actions/cover-letter";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "../../../components/ui/ai-button";
import CoverLetterList from "./_components/cover-letter-list";
import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "../../../actions/user";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">My Cover Letters</h1>
        <Link href="/ai-cover-letter/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
}
