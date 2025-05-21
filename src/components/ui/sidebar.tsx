
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import React from "react";

interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
}

export function Sidebar({ className, children }: SidebarProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (!isDesktop) {
    return null;
  }

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        {children}
      </div>
    </div>
  );
}
