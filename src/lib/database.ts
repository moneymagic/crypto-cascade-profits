import { supabase } from '@/lib/supabase';
import type { Profile } from './supabase';
import { Database } from './database.types';

// Para Copy Trading
export async function getFollowedTraders(userId: string) {
  const { data, error } = await supabase
    .from('followed_traders')
    .select(`
      *,
      trader:traders(*)
    `)
    .eq('user_id', userId)
    .eq('active', true);
    
  if (error) throw error;
  return data;
}

export async function getTrades(userId: string, status?: string) {
  const query = supabase
    .from('trades')
    .select(`
      *,
      trader:traders(name)
    `)
    .eq('user_id', userId);
    
  if (status) {
    query.eq('status', status);
  }
  
  const { data, error } = await query.order('date', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function followTrader(userId: string, traderId: string, allocationPercent: number) {
  const { data, error } = await supabase
    .from('followed_traders')
    .insert({
      user_id: userId,
      trader_id: traderId,
      allocation_percent: allocationPercent,
      active: true
    });
  
  if (error) throw error;
  return data;
}

export async function stopFollowingTrader(id: string) {
  const { data, error } = await supabase
    .from('followed_traders')
    .update({ active: false })
    .eq('id', id);
  
  if (error) throw error;
  return data;
}

// Para Earnings
export async function getEarnings(userId: string, type?: string) {
  const query = supabase
    .from('earnings')
    .select('*')
    .eq('user_id', userId);
  
  if (type) {
    query.eq('type', type);
  }
  
  const { data, error } = await query.order('date', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getTotalEarnings(userId: string) {
  const { data, error } = await supabase
    .from('earnings')
    .select('amount, type')
    .eq('user_id', userId);
  
  if (error) throw error;
  
  // Separar por tipo
  const copyTradingEarnings = data
    .filter(earning => earning.type === 'copy_trading')
    .reduce((sum, earning) => sum + earning.amount, 0);
  
  const referralEarnings = data
    .filter(earning => earning.type === 'referral_bonus')
    .reduce((sum, earning) => sum + earning.amount, 0);
  
  const masterEarnings = data
    .filter(earning => earning.type === 'master_bonus')
    .reduce((sum, earning) => sum + earning.amount, 0);
    
  const totalEarnings = data.reduce((sum, earning) => sum + earning.amount, 0);
  
  return {
    total: totalEarnings,
    copyTrading: copyTradingEarnings,
    referral: referralEarnings,
    master: masterEarnings
  };
}

// Para Wallet
export async function getUserBalance(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data?.balance || 0;
}

export async function getTransactions(userId: string, type?: string) {
  const query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId);
  
  if (type) {
    query.eq('type', type);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getRetainedBalanceByTrader(userId: string) {
  const { data, error } = await supabase
    .from('followed_traders')
    .select(`
      *,
      trader:traders(name)
    `)
    .eq('user_id', userId)
    .eq('active', true);
  
  if (error) throw error;
  
  // Para cada trader seguido, calcula um valor fictício de retenção
  // Em uma implementação real, isso viria de cálculos baseados em operações
  return data.map(item => ({
    id: item.id,
    traderName: item.trader.name,
    allocation: item.allocation_percent,
    retainedBalance: (item.allocation_percent * 5) // Valor fictício para demonstração
  }));
}

// Para Network
export async function getReferrals(userId: string) {
  const { data, error } = await supabase
    .from('referrals')
    .select(`
      *,
      referred:profiles!referred_user_id(full_name, email, created_at)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

export async function getUserRanks(userId: string) {
  const { data, error } = await supabase
    .from('user_ranks')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

export async function generateReferralLink(userId: string) {
  // Em produção, gerar um código único para o usuário
  return `https://vastcopy.com/ref/${userId.substring(0, 8)}`;
}

export async function getReferralStats(userId: string) {
  const { data, error } = await supabase
    .from('referrals')
    .select('status')
    .eq('user_id', userId);
  
  if (error) throw error;
  
  const totalReferrals = data.length;
  const activeReferrals = data.filter(ref => ref.status === 'active').length;
  
  return { total: totalReferrals, active: activeReferrals };
}

// Funções para gerenciar chaves de API
export async function saveApiKey(userId: string, exchange: string, apiKey: string, apiSecret: string, isTestnet: boolean) {
  // Verificar se já existe uma chave para esse usuário e exchange
  const { data: existingKeys } = await supabase
    .from('api_keys')
    .select('id')
    .eq('user_id', userId)
    .eq('exchange', exchange);

  if (existingKeys && existingKeys.length > 0) {
    // Atualizar chave existente
    const { data, error } = await supabase
      .from('api_keys')
      .update({
        api_key: apiKey,
        api_secret: apiSecret,
        is_testnet: isTestnet,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingKeys[0].id);
    
    if (error) throw error;
    return data;
  } else {
    // Inserir nova chave
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        exchange,
        api_key: apiKey,
        api_secret: apiSecret,
        is_testnet: isTestnet
      });
    
    if (error) throw error;
    return data;
  }
}

export async function getApiKeys(userId: string, exchange?: string) {
  const query = supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', userId);
  
  if (exchange) {
    query.eq('exchange', exchange);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

export async function deleteApiKey(id: string) {
  const { data, error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return data;
}
