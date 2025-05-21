
import { useState, useEffect } from "react";

type UseIdleTimerProps = {
  timeout: number; // tempo em milissegundos
  onIdle: () => void;
  debounce?: number;
};

export const useIdleTimer = ({ 
  timeout, 
  onIdle,
  debounce = 500 
}: UseIdleTimerProps) => {
  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(timeout);

  // Reiniciar o timer quando houver atividade
  const handleActivity = () => {
    setLastActivity(Date.now());
    setIsIdle(false);
  };

  // Configurar os listeners de eventos de atividade
  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;
    
    const activityEvents = [
      "mousedown", 
      "mousemove", 
      "keydown", 
      "scroll", 
      "touchstart", 
      "click"
    ];
    
    const debouncedActivityHandler = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(handleActivity, debounce);
    };

    // Adicionar listeners para eventos de atividade
    activityEvents.forEach(eventName => {
      window.addEventListener(eventName, debouncedActivityHandler);
    });

    // Limpar os listeners quando o componente for desmontado
    return () => {
      activityEvents.forEach(eventName => {
        window.removeEventListener(eventName, debouncedActivityHandler);
      });
      clearTimeout(debounceTimer);
    };
  }, [debounce]);

  // Verificar inatividade a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      
      // Calcular tempo restante
      const remaining = Math.max(0, timeout - timeSinceLastActivity);
      setTimeRemaining(remaining);
      
      // Se atingiu o tempo limite e ainda não está marcado como inativo
      if (timeSinceLastActivity >= timeout && !isIdle) {
        setIsIdle(true);
        onIdle();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeout, lastActivity, isIdle, onIdle]);

  // Resetar o timer manualmente
  const resetTimer = () => {
    handleActivity();
  };

  return {
    isIdle,
    timeRemaining,
    resetTimer,
  };
};
