
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import VastCopyLogo from "@/components/logo/VastCopyLogo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { User, Users, TrendingUp, Exchange, Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarItem {
  path: string;
  label: string;
  icon: JSX.Element;
  variant?: "default" | "ghost" | "outline" | "destructive" | "secondary" | null | undefined;
  disabled?: boolean;
}

const MainSidebar = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { pathname } = useLocation();
  const { user } = useAuth();

  const sidebarItems: SidebarItem[] = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <TrendingUp className="mr-2 h-4 w-4" />,
    },
    {
      path: "/copy-trading",
      label: "Copy Trading",
      icon: <Exchange className="mr-2 h-4 w-4" />,
    },
    {
      path: "/bybit-copy-trading",
      label: "Bybit Copy",
      icon: <Exchange className="mr-2 h-4 w-4" />,
    },
    {
      path: "/earnings",
      label: "Rendimentos",
      icon: <TrendingUp className="mr-2 h-4 w-4" />,
    },
    {
      path: "/wallet",
      label: "Carteira",
      icon: <Wallet className="mr-2 h-4 w-4" />,
    },
    {
      path: "/network",
      label: "Sua Rede",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      path: "/settings",
      label: "Configurações",
      icon: <User className="mr-2 h-4 w-4" />,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2">
        <NavLink 
          to="/"
          className="flex items-center pl-2 my-4 mb-6"
          onClick={() => setOpen(false)}
        >
          <VastCopyLogo className="h-8" />
          <span className="ml-2 text-lg font-medium">VastCopy</span>
        </NavLink>
        {user ? (
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center text-sm font-medium py-2 px-3 rounded-md transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <NavLink
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center text-sm font-medium py-2 px-3 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <User className="mr-2 h-4 w-4" />
              Login
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );

  if (isDesktop) {
    return <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:bg-background">{sidebarContent}</aside>;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden ml-2">
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 sm:max-w-xs p-0">
        {sidebarContent}
      </SheetContent>
    </Sheet>
  );
};

export default MainSidebar;
