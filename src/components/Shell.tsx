"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    // Billion Dollar Landing Page Mode (Full Screen, No Sidebar)
    return <>{children}</>;
  }

  // App Mode (Sidebar + Content + Your specific colors)
  return (
    <div className="flex min-h-screen bg-lumaire-ivory text-lumaire-brown">
      <Sidebar />
      {/* Push content right by 16rem (64) to account for fixed sidebar */}
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}
