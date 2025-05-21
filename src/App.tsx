
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

// Auth
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Pages
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Traders from '@/pages/Traders';
import Dashboard from '@/pages/Dashboard';
import TraderProfile from '@/pages/TraderProfile';
import Settings from '@/pages/Settings';
import Wallet from '@/pages/Wallet';
import Network from '@/pages/Network';
import CopyTrading from '@/pages/CopyTrading';
import Earnings from '@/pages/Earnings';
import Bonus from '@/pages/Bonus';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import MasterTraderSignup from '@/pages/MasterTraderSignup';
import Transactions from '@/pages/Transactions';

// Componente para proteger rotas que exigem autenticação
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, resetIdleTimer } = useAuth();
  
  // Resetar o timer de inatividade quando acessar uma rota protegida
  useEffect(() => {
    if (user) {
      resetIdleTimer();
    }
  }, [user, resetIdleTimer]);
  
  // Mostrar tela de carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
  
  // Redirecionar para login se não estiver autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Componente para a aplicação principal com monitoramento de atividade
function AppContent() {
  const { resetIdleTimer, user } = useAuth();
  
  // Resetar o timer de inatividade quando houver interação do usuário
  useEffect(() => {
    if (!user) return;
    
    const handleUserActivity = () => {
      resetIdleTimer();
    };
    
    // Eventos para monitorar atividade
    const events = ["click", "keypress", "scroll", "mousemove"];
    
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [resetIdleTimer, user]);
  
  return (
    <Routes>
      {/* Rota principal redireciona para dashboard */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rotas protegidas */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/traders" element={<ProtectedRoute><Traders /></ProtectedRoute>} />
      <Route path="/trader/:traderId" element={<ProtectedRoute><TraderProfile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
      <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
      <Route path="/copy-trading" element={<ProtectedRoute><CopyTrading /></ProtectedRoute>} />
      <Route path="/earnings" element={<ProtectedRoute><Earnings /></ProtectedRoute>} />
      <Route path="/bonus" element={<ProtectedRoute><Bonus /></ProtectedRoute>} />
      <Route path="/master-trader-signup" element={<ProtectedRoute><MasterTraderSignup /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      
      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
        
        {/* Toasters */}
        <Toaster />
        <SonnerToaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
