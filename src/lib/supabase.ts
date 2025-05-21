
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// URL e chave do Supabase
const supabaseUrl = 'https://jxsdtxgnayujpvpbxisk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4c2R0eGduYXl1anB2cGJ4aXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MDgzOTksImV4cCI6MjA2MzM4NDM5OX0.-7Ka-yNeDTlmIad5aCB73-CGsw78NQmrDiBvSVxFrPA';

// Criar o cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Tipos para usuário
export type Profile = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  balance?: number
}

// Auth helpers
export async function signUp(email: string, password: string, fullName: string) {
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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile() {
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

// Função para reenviar e-mail de confirmação
export async function resendConfirmationEmail(email: string) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  })
  
  if (error) throw error
}
