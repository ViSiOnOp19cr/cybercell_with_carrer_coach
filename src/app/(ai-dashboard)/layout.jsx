import React from "react";
import { Navbar } from "@/components/Navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const MainLayout = async ({ children }) => {
  return (
    <div className={`min-h-screen flex flex-col ${inter.className}`}>
      <Navbar />
      <main className="flex-1 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <footer className="bg-black/50 backdrop-blur-sm py-4 border-t border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} CyberQuest. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
