
-- Criação da tabela followed_traders
CREATE TABLE IF NOT EXISTS public.followed_traders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  trader_id UUID REFERENCES public.traders(id) NOT NULL,
  allocation_percent NUMERIC NOT NULL,
  active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Criação da tabela trades
CREATE TABLE IF NOT EXISTS public.trades (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  trader_id UUID REFERENCES public.traders(id) NOT NULL,
  pair VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  entry_price NUMERIC NOT NULL,
  current_price NUMERIC NOT NULL,
  amount NUMERIC NOT NULL,
  status VARCHAR NOT NULL,
  profit VARCHAR NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Criação da tabela earnings
CREATE TABLE IF NOT EXISTS public.earnings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  type VARCHAR NOT NULL,
  amount NUMERIC NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR NOT NULL,
  trader_id UUID REFERENCES public.traders(id),
  strategy VARCHAR,
  level INTEGER,
  rank VARCHAR,
  referred_user UUID REFERENCES public.profiles(id),
  user_rank VARCHAR,
  difference_rate VARCHAR,
  followers INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Criação da tabela referrals
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  referred_user_id UUID REFERENCES public.profiles(id) NOT NULL,
  level INTEGER NOT NULL,
  status VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Criação da tabela user_ranks
CREATE TABLE IF NOT EXISTS public.user_ranks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  rank VARCHAR NOT NULL,
  bonus_rate VARCHAR NOT NULL,
  progress NUMERIC NOT NULL,
  target VARCHAR NOT NULL,
  earned VARCHAR NOT NULL,
  required_referrals VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Adicionar políticas de segurança Row Level Security (RLS)
ALTER TABLE public.followed_traders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ranks ENABLE ROW LEVEL SECURITY;

-- Política para followed_traders: usuários só podem ver/modificar seus próprios registros
CREATE POLICY "Usuários podem visualizar apenas seus próprios followed_traders" 
  ON public.followed_traders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir apenas seus próprios followed_traders" 
  ON public.followed_traders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar apenas seus próprios followed_traders" 
  ON public.followed_traders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Políticas semelhantes para as outras tabelas
-- Para trades
CREATE POLICY "Usuários podem visualizar apenas suas próprias trades" 
  ON public.trades 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir apenas suas próprias trades" 
  ON public.trades 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Para earnings
CREATE POLICY "Usuários podem visualizar apenas seus próprios earnings" 
  ON public.earnings 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Para referrals
CREATE POLICY "Usuários podem visualizar apenas seus próprios referrals" 
  ON public.referrals 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Para user_ranks
CREATE POLICY "Usuários podem visualizar apenas seus próprios ranks" 
  ON public.user_ranks 
  FOR SELECT 
  USING (auth.uid() = user_id);
