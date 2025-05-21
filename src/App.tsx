
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/ui/theme-provider';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CopyTrading from './pages/CopyTrading';
import BybitCopyTrading from './pages/BybitCopyTrading';
import Earnings from './pages/Earnings';
import Wallet from './pages/Wallet';
import Network from './pages/Network';
import Bonus from './pages/Bonus';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Trades from './pages/Trades';
import Transactions from './pages/Transactions';
import Index from './pages/Index';
import MasterTraderSignup from './pages/MasterTraderSignup';
import Traders from './pages/Traders';
import TraderProfile from './pages/TraderProfile';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vastcopy-ui-theme">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/copy-trading" element={<CopyTrading />} />
            <Route path="/bybit-copy-trading" element={<BybitCopyTrading />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/network" element={<Network />} />
            <Route path="/bonus" element={<Bonus />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/become-master" element={<MasterTraderSignup />} />
            <Route path="/traders" element={<Traders />} />
            <Route path="/trader/:id" element={<TraderProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
