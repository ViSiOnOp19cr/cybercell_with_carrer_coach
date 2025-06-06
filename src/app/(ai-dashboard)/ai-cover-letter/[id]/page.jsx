import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CoverLetterEditor } from "@/components/cover-letter/cover-letter-editor";
import { CoverLetterHeader } from "@/components/cover-letter/cover-letter-header";
import { CoverLetterSidebar } from "@/components/cover-letter/cover-letter-sidebar";
import { CoverLetterProvider } from "@/components/cover-letter/cover-letter-context";

/**
 * @typedef {Object} PageProps
 * @property {Promise<{id: string}>} params
 */

/**
 * @param {PageProps} props
 */
export default async function CoverLetterPage({ params }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get user data
  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect("/onboarding");
  }

  // Get cover letter data
  const coverLetter = await db.coverLetter.findUnique({
    where: {
      id: params.id,
      userId: user.id,
    },
  });

  if (!coverLetter) {
    redirect("/ai-cover-letter");
  }

  return (
    <CoverLetterProvider initialData={coverLetter}>
      <div className="flex h-screen">
        <CoverLetterSidebar />
        <div className="flex-1 flex flex-col">
          <CoverLetterHeader />
          <main className="flex-1 overflow-y-auto">
            <CoverLetterEditor />
          </main>
        </div>
      </div>
    </CoverLetterProvider>
  );
}
