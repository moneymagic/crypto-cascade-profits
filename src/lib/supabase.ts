
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Verificar se as variáveis de ambiente necessárias estão disponíveis
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificar se as variáveis estão definidas
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL ou ANON KEY não definidos nas variáveis de ambiente.");
  console.error(`
    Para resolver este erro:
    1. Crie um projeto no Supabase (https://supabase.com)
    2. Configure as variáveis de ambiente no Lovable
    3. Adicione as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY com os valores do seu projeto Supabase
  `);
}

// Cria uma instância do cliente Supabase com verificação para evitar erros
export const supabase = supabaseUrl && supabaseKey 
  ? createClient<Database>(supabaseUrl, supabaseKey)
  : null;

// Tipos para usuário
export type Profile = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

// Auth helpers
export async function signUp(email: string, password: string, fullName: string) {
  if (!supabase) throw new Error("Cliente Supabase não está inicializado. Verifique suas variáveis de ambiente.");
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })
  
  if (error) throw error
  
  return data
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error("Cliente Supabase não está inicializado. Verifique suas variáveis de ambiente.");
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  
  return data
}

export async function signOut() {
  if (!supabase) throw new Error("Cliente Supabase não está inicializado. Verifique suas variáveis de ambiente.");
  
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  if (!supabase) throw new Error("Cliente Supabase não está inicializado. Verifique suas variáveis de ambiente.");
  
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile() {
  if (!supabase) throw new Error("Cliente Supabase não está inicializado. Verifique suas variáveis de ambiente.");
  
  const user = await getCurrentUser()
  if (!user) return null
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
    
  if (error) throw error
  
  return data
}
