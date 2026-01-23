"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // HIDE SIDEBAR IF:
  // 1. It is the Landing Page ("/")
  // 2. It is a Public Share Link (starts with "/share")
  const isPublic = pathname === "/" || pathname?.startsWith("/share");

  if (isPublic) {
    return <>{children}</>;
  }

  // App Mode (Sidebar + Content + Your specific colors)
  return (
    <div className="flex min-h-screen bg-lumaire-ivory text-lumaire-brown">
      <Sidebar />
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}
