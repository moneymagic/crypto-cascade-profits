
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  PieChart, 
  Copy, 
  BarChart, 
  Settings,
  Wallet,
  WifiHigh
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
    { icon: WifiHigh, label: "Network", path: "/network" },
    { icon: BarChart, label: "Ganhos", path: "/earnings" },
    { icon: Wallet, label: "Carteira", path: "/wallet" },
  ];

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col bg-vastcopy-navy border-r border-vastcopy-navy/30">
      <div className="p-6">
        <VastCopyLogo textColor="text-white" />
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
                active ? "bg-vastcopy-teal/20 text-vastcopy-teal" : "text-white/70 hover:text-white hover:bg-vastcopy-teal/10"
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
            isActive("/settings") ? "bg-vastcopy-teal/20 text-vastcopy-teal" : "text-white/70 hover:text-white hover:bg-vastcopy-teal/10"
          )}
        >
          <Settings className="mr-2 h-5 w-5" />
          Configurações
        </Link>
      </div>
    </aside>
  );
}
