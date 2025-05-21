
-- Criação da tabela api_keys para armazenar chaves de API de forma segura
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  exchange VARCHAR NOT NULL,
  api_key VARCHAR NOT NULL,
  api_secret VARCHAR NOT NULL,
  is_testnet BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Ativar Row Level Security
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Políticas para api_keys: usuários só podem ver/modificar suas próprias chaves
CREATE POLICY "Usuários podem visualizar apenas suas próprias api_keys" 
  ON public.api_keys 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir apenas suas próprias api_keys" 
  ON public.api_keys 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar apenas suas próprias api_keys" 
  ON public.api_keys 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir apenas suas próprias api_keys" 
  ON public.api_keys 
  FOR DELETE 
  USING (auth.uid() = user_id);
