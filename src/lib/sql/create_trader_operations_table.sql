
-- Tabela para armazenar as operações originais dos master traders
CREATE TABLE IF NOT EXISTS public.trader_operations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trader_id UUID REFERENCES public.traders(id) NOT NULL,
  symbol VARCHAR NOT NULL,
  side VARCHAR NOT NULL,
  quantity VARCHAR NOT NULL,
  price VARCHAR NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Ativar Row Level Security
ALTER TABLE public.trader_operations ENABLE ROW LEVEL SECURITY;

-- Política para visualização: apenas o trader e administradores podem ver
CREATE POLICY "Traders podem visualizar apenas suas próprias operações" 
  ON public.trader_operations 
  FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.traders WHERE id = trader_id
    )
  );

-- Política para inserção: sistema e administradores podem inserir
CREATE POLICY "Sistema pode inserir operações de traders" 
  ON public.trader_operations 
  FOR INSERT 
  WITH CHECK (true);

-- Adicionar campo order_id à tabela trades
ALTER TABLE public.trades 
ADD COLUMN IF NOT EXISTS order_id VARCHAR;
