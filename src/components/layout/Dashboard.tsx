
import { ReactNode } from "react";
import MainSidebar from "./MainSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full">
      <MainSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
