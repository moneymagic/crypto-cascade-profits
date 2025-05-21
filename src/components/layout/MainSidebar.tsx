
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  PieChart, 
  Copy, 
  Gift, 
  BarChart, 
  Settings,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { VastCopyLogo } from "../logo/VastCopyLogo";

export function MainSidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "Traders", path: "/traders" },
    { icon: PieChart, label: "Portfolio", path: "/portfolio" },
    { icon: Copy, label: "Copy Trading", path: "/copy-trading" },
    { icon: Gift, label: "Bônus", path: "/bonus" },
    { icon: BarChart, label: "Ganhos", path: "/earnings" },
    { icon: Wallet, label: "Carteira", path: "/wallet" },
  ];

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <VastCopyLogo />
      </div>
      
      <div className="mt-6 flex flex-col gap-1 px-2">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start h-10",
                active ? "bg-sidebar-primary/20 text-sidebar-primary" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-primary/10"
              )}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
      
      <div className="mt-auto p-4">
        <Link
          to="/settings"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start w-full",
            isActive("/settings") ? "bg-sidebar-primary/20 text-sidebar-primary" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-primary/10"
          )}
        >
          <Settings className="mr-2 h-5 w-5" />
          Configurações
        </Link>
      </div>
    </aside>
  );
}
