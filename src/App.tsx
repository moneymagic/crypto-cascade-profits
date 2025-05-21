
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Traders from "./pages/Traders";
import Portfolio from "./pages/Portfolio";
import CopyTrading from "./pages/CopyTrading";
import Bonus from "./pages/Bonus";
import Earnings from "./pages/Earnings";
import Wallet from "./pages/Wallet";
import Settings from "./pages/Settings";
import Network from "./pages/Network";
import MasterTraderSignup from "./pages/MasterTraderSignup";
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
          <Route path="/bonus" element={<Bonus />} />
          <Route path="/network" element={<Network />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/master-trader-signup" element={<MasterTraderSignup />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
