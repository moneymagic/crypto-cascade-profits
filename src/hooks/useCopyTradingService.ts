
import { useState, useEffect } from 'react';
import copyTradingService from '@/services/CopyTradingService';
import { useAuth } from '@/contexts/AuthContext';

export function useCopyTradingService() {
  const { user } = useAuth();
  const [isServiceActive, setIsServiceActive] = useState(false);

  // Iniciar o serviço de copy trading quando o componente é montado
  useEffect(() => {
    // Só iniciar o serviço se houver um usuário logado
    if (user) {
      startService();
    }

    // Limpar quando o componente é desmontado
    return () => {
      stopService();
    };
  }, [user]);

  // Iniciar o serviço de copy trading
  const startService = async () => {
    try {
      await copyTradingService.startService();
      setIsServiceActive(true);
    } catch (error) {
      console.error('Erro ao iniciar serviço de copy trading:', error);
    }
  };

  // Parar o serviço de copy trading
  const stopService = () => {
    try {
      copyTradingService.stopService();
      setIsServiceActive(false);
    } catch (error) {
      console.error('Erro ao parar serviço de copy trading:', error);
    }
  };

  // Alternar estado do serviço
  const toggleService = async () => {
    if (isServiceActive) {
      stopService();
    } else {
      await startService();
    }
  };

  return {
    isServiceActive,
    startService,
    stopService,
    toggleService
  };
}

export default useCopyTradingService;
