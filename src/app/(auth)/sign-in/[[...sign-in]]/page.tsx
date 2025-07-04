import { SignIn } from "@clerk/nextjs";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Cybersecurity Platform",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div className="w-full">
      <h1 className="mb-6 text-center text-2xl font-bold">Sign In</h1>
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            footerActionLink: "text-blue-600 hover:text-blue-700",
            headerTitle: "Sign in to CyberQuest",
            headerSubtitle: "Welcome back! Please sign in to continue",
            logoBox: "hidden",
            logoImage: "hidden",
          },
          variables: {
            colorPrimary: "#3b82f6",
          },
        }}
        redirectUrl="/dashboard"
      />
    </div>
  );
} 