
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  ChartBar, 
  Coins, 
  Users, 
  BadgeDollarSign, 
  Wallet, 
  BadgePercent 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: ChartBar,
  },
  {
    title: "Master Traders",
    href: "/traders",
    icon: Users,
  },
  {
    title: "My Portfolio",
    href: "/portfolio",
    icon: Wallet,
  },
  {
    title: "Copy Trading",
    href: "/copy-trading",
    icon: Coins,
  },
  {
    title: "Bonus Network",
    href: "/bonus",
    icon: BadgePercent,
  },
  {
    title: "Earnings",
    href: "/earnings",
    icon: BadgeDollarSign,
  }
];

export function MainSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "bg-sidebar flex flex-col h-screen sticky top-0 transition-all duration-300 border-r border-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="text-xl font-bold bg-gradient-trading bg-clip-text text-transparent">
            CopyTrade Pro
          </div>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>
      
      <nav className="flex-1 overflow-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        {!collapsed ? (
          <Button className="w-full" variant="outline">
            Connect Wallet
          </Button>
        ) : (
          <Button size="icon" variant="outline" className="w-full">
            <Wallet className="h-4 w-4" />
          </Button>
        )}
      </div>
    </aside>
  );
}
