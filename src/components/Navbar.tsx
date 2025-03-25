import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";
import {
  Shield,
  Terminal,
  Trophy,
  Home,
  BarChart,
  Briefcase,
  LayoutDashboard,
  StarsIcon,
  ChevronDown,
  FileText,
  PenBox,
  GraduationCap,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black/50 backdrop-blur-lg border-b border-green-500/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Shield className="h-8 w-8 text-green-500" />
              <span className="ml-2 text-xl font-bold text-white">
                CyberQuest
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-green-400 hover:text-green-300"
              >
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <Home className="mr-1 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link
                href="/levels"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-green-300"
              >
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <Terminal className="mr-1 h-4 w-4" />
                  Levels
                </Button>
              </Link>
              <Link
                href="/achievements"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-green-300"
              >
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <Trophy className="mr-1 h-4 w-4" />
                  Achievements
                </Button>
              </Link>
              <Link
                href="/leaderboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-green-300"
              >
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <BarChart className="mr-1 h-4 w-4" />
                  Leaderboard
                </Button>
              </Link>

              <Link
                href="/career-coach"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-green-300"
              >
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Career Coach
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
              </Link>

              <div className="flex items-center space-x-2 md:space-x-4">
                <SignedIn>
                  {/* Growth Tools Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="hidden md:inline-flex items-center gap-2"
                      >
                        <StarsIcon className="h-4 w-4" />
                        <span>Growth Tools</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 bg-black/50 backdrop-blur-lg border border-green-500/20"
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href="/resume"
                          className="flex items-center gap-2 text-white hover:text-green-300"
                        >
                          <FileText className="h-4 w-4" />
                          Build Resume
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/ai-cover-letter"
                          className="flex items-center gap-2 text-white hover:text-green-300"
                        >
                          <PenBox className="h-4 w-4" />
                          Cover Letter
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/interview"
                          className="flex items-center gap-2 text-white hover:text-green-300"
                        >
                          <GraduationCap className="h-4 w-4" />
                          Interview Prep
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SignedIn>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Link
              href="/profile"
              className="mr-4 text-white hover:text-green-300"
            >
              <div className="flex items-center">
                <span className="hidden md:inline mr-1">
                  <Button
                    variant="outline"
                    className="hidden md:inline-flex items-center gap-2"
                  >
                    Profile
                  </Button>
                </span>
              </div>
            </Link>
            <div className="flex-shrink-0">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden border-t border-green-500/10">
        <div className="pt-2 pb-3 space-y-1 grid grid-cols-5">
          <Link
            href="/dashboard"
            className="text-green-400 hover:text-green-300 flex flex-col items-center py-2"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            href="/levels"
            className="text-white hover:text-green-300 flex flex-col items-center py-2"
          >
            <Terminal className="h-5 w-5" />
            <span className="text-xs mt-1">Levels</span>
          </Link>
          <Link
            href="/achievements"
            className="text-white hover:text-green-300 flex flex-col items-center py-2"
          >
            <Trophy className="h-5 w-5" />
            <span className="text-xs mt-1">Badges</span>
          </Link>
          <Link
            href="/leaderboard"
            className="text-white hover:text-green-300 flex flex-col items-center py-2"
          >
            <BarChart className="h-5 w-5" />
            <span className="text-xs mt-1">Leaders</span>
          </Link>
          <Link
            href="/career-coach"
            className="text-white hover:text-green-300 flex flex-col items-center py-2"
          >
            <Briefcase className="h-5 w-5" />
            <span className="text-xs mt-1">Career</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
