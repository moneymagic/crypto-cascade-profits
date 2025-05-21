
import { supabase } from '@/lib/supabase';

// Função para adicionar dados de exemplo ao banco de dados
// Use apenas em desenvolvimento e teste
export async function seedDatabase(userId: string) {
  try {
    // Adicionar traders
    const traders = [
      {
        id: 'trader-1',
        name: 'Carlos Almeida',
        avatar_url: null,
        win_rate: '78%',
        followers: '120',
        profit_30d: '+32.5%',
        profit_90d: '+67.8%',
        positive: true,
        verified: true,
        specialization: 'BTC/ETH',
        description: 'Especialista em operações de longo prazo em Bitcoin e Ethereum',
        user_id: userId
      },
      {
        id: 'trader-2',
        name: 'Márcia Oliveira',
        avatar_url: null,
        win_rate: '81%',
        followers: '205',
        profit_30d: '+41.2%',
        profit_90d: '+92.5%',
        positive: true,
        verified: true,
        specialization: 'DeFi',
        description: 'Foco em tokens DeFi e yield farming strategies',
        user_id: userId
      }
    ];
    
    // Adicionar traders seguidos
    const followedTraders = [
      {
        user_id: userId,
        trader_id: 'trader-1',
        allocation_percent: 25,
        active: true
      },
      {
        user_id: userId,
        trader_id: 'trader-2',
        allocation_percent: 30,
        active: true
      }
    ];
    
    // Adicionar operações
    const trades = [
      {
        user_id: userId,
        trader_id: 'trader-1',
        pair: 'BTC/USDT',
        type: 'buy',
        entry_price: 62450.00,
        current_price: 63100.00,
        amount: 0.15,
        status: 'open',
        profit: '+4.18%',
        date: new Date().toISOString()
      },
      {
        user_id: userId,
        trader_id: 'trader-2',
        pair: 'ETH/USDT',
        type: 'sell',
        entry_price: 3450.00,
        current_price: 3380.00,
        amount: 1.2,
        status: 'open',
        profit: '+2.03%',
        date: new Date().toISOString()
      },
      {
        user_id: userId,
        trader_id: 'trader-1',
        pair: 'SOL/USDT',
        type: 'buy',
        entry_price: 145.20,
        current_price: 146.80,
        amount: 10,
        status: 'closed',
        profit: '+1.10%',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Ontem
      }
    ];
    
    // Adicionar ganhos
    const earnings = [
      {
        user_id: userId,
        type: 'copy_trading',
        amount: 345.28,
        date: new Date().toISOString(),
        status: 'paid',
        trader_id: 'trader-1',
        strategy: 'BTC/ETH Swing'
      },
      {
        user_id: userId,
        type: 'referral_bonus',
        amount: 42.75,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
        status: 'paid',
        level: 1,
        rank: 'V1',
        referred_user: 'João Silva',
        user_rank: 'V1',
        difference_rate: '1%'
      },
      {
        user_id: userId,
        type: 'copy_trading',
        amount: 198.50,
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 dias atrás
        status: 'paid',
        trader_id: 'trader-2',
        strategy: 'DeFi Yield'
      },
      {
        user_id: userId,
        type: 'master_bonus',
        amount: 25.15,
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 dias atrás
        status: 'paid',
        followers: 5,
        strategy: 'BTC/ETH Long'
      }
    ];
    
    // Adicionar transações
    const transactions = [
      {
        user_id: userId,
        amount: 500.00,
        type: 'deposit',
        status: 'completed',
        description: 'Depósito de Gas Fee',
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 dias atrás
      },
      {
        user_id: userId,
        amount: 45.20,
        type: 'fee',
        status: 'completed',
        description: 'Taxa de Copy Trading - Semana 20',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 dia atrás
      },
      {
        user_id: userId,
        amount: 210.50,
        type: 'profit',
        status: 'pending',
        description: 'Lucro retido aguardando liquidação',
        created_at: new Date().toISOString()
      },
      {
        user_id: userId,
        amount: 125.30,
        type: 'network',
        status: 'completed',
        description: 'Bônus de Rede - Nível V3',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 dias atrás
      }
    ];
    
    // Adicionar referências de usuário
    const referrals = [
      {
        user_id: userId,
        referred_user_id: 'ref-user-1',
        level: 1,
        status: 'active'
      },
      {
        user_id: userId,
        referred_user_id: 'ref-user-2',
        level: 1,
        status: 'active'
      },
      {
        user_id: userId,
        referred_user_id: 'ref-user-3',
        level: 2,
        status: 'inactive'
      }
    ];
    
    // Adicionar rankings do usuário
    const userRanks = [
      {
        user_id: userId,
        rank: "V1",
        bonus_rate: "4%",
        progress: 100,
        target: "Cadastro",
        earned: "$40",
        required_referrals: "Nenhum"
      },
      {
        user_id: userId,
        rank: "V2",
        bonus_rate: "5%",
        progress: 65,
        target: "$1.000",
        earned: "$50",
        required_referrals: "Nenhum"
      },
      {
        user_id: userId,
        rank: "V3",
        bonus_rate: "6%",
        progress: 20,
        target: "$3.000",
        earned: "$18",
        required_referrals: "2 indicados V2"
      }
    ];
    
    // Inserir todos os dados no banco
    await Promise.all([
      supabase.from('traders').upsert(traders),
      supabase.from('followed_traders').upsert(followedTraders),
      supabase.from('trades').upsert(trades),
      supabase.from('earnings').upsert(earnings),
      supabase.from('transactions').upsert(transactions),
      supabase.from('referrals').upsert(referrals),
      supabase.from('user_ranks').upsert(userRanks),
      // Atualizar o saldo do usuário
      supabase.from('profiles').update({ balance: 1500.00 }).eq('id', userId)
    ]);
    
    return true;
  } catch (error) {
    console.error('Erro ao popular banco de dados:', error);
    return false;
  }
}

// Função para usar em um botão para popular o banco com dados de teste
export async function populateTestData(userId: string) {
  const success = await seedDatabase(userId);
  return success;
}
