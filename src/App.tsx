
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Traders from "./pages/Traders";
import Portfolio from "./pages/Portfolio";
import CopyTrading from "./pages/CopyTrading";
import Earnings from "./pages/Earnings";
import Wallet from "./pages/Wallet";
import Settings from "./pages/Settings";
import Network from "./pages/Network";
import TraderProfile from "./pages/TraderProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/traders" element={<Traders />} />
          <Route path="/trader/:traderId" element={<TraderProfile />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/copy-trading" element={<CopyTrading />} />
          <Route path="/network" element={<Network />} />
          <Route path="/bonus" element={<Navigate to="/network" replace />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/master-trader-signup" element={<Navigate to="/settings?tab=mastertrader" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
