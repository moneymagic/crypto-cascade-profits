export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          email: string | null
          created_at: string
          updated_at: string | null
          balance: number
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string | null
          balance?: number
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string | null
          balance?: number
        }
      }
      traders: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          win_rate: string
          followers: string
          profit_30d: string
          profit_90d: string
          positive: boolean
          verified: boolean
          specialization: string
          description: string
          user_id: string
          api_key: string | null
          api_secret: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          avatar_url?: string | null
          win_rate?: string
          followers?: string
          profit_30d?: string
          profit_90d?: string
          positive?: boolean
          verified?: boolean
          specialization: string
          description: string
          user_id: string
          api_key?: string | null
          api_secret?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          win_rate?: string
          followers?: string
          profit_30d?: string
          profit_90d?: string
          positive?: boolean
          verified?: boolean
          specialization?: string
          description?: string
          user_id?: string
          api_key?: string | null
          api_secret?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: string
          status: string
          created_at: string
          updated_at: string | null
          description: string | null
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: string
          status?: string
          created_at?: string
          updated_at?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: string
          status?: string
          created_at?: string
          updated_at?: string | null
          description?: string | null
        }
      }
      followed_traders: {
        Row: {
          id: string
          user_id: string
          trader_id: string
          allocation_percent: number
          active: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          trader_id: string
          allocation_percent: number
          active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          trader_id?: string
          allocation_percent?: number
          active?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      trades: {
        Row: {
          id: string
          user_id: string
          trader_id: string
          pair: string
          type: string
          entry_price: number
          current_price: number
          amount: number
          status: string
          profit: string
          date: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          trader_id: string
          pair: string
          type: string
          entry_price: number
          current_price: number
          amount: number
          status: string
          profit: string
          date: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          trader_id?: string
          pair?: string
          type?: string
          entry_price?: number
          current_price?: number
          amount?: number
          status?: string
          profit?: string
          date?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      earnings: {
        Row: {
          id: string
          user_id: string
          type: string
          amount: number
          date: string
          status: string
          trader_id: string | null
          strategy: string | null
          level: number | null
          rank: string | null
          referred_user: string | null
          user_rank: string | null
          difference_rate: string | null
          followers: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          amount: number
          date: string
          status: string
          trader_id?: string | null
          strategy?: string | null
          level?: number | null
          rank?: string | null
          referred_user?: string | null
          user_rank?: string | null
          difference_rate?: string | null
          followers?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          amount?: number
          date?: string
          status?: string
          trader_id?: string | null
          strategy?: string | null
          level?: number | null
          rank?: string | null
          referred_user?: string | null
          user_rank?: string | null
          difference_rate?: string | null
          followers?: number | null
          created_at?: string
          updated_at?: string | null
        }
      }
      referrals: {
        Row: {
          id: string
          user_id: string
          referred_user_id: string
          level: number
          status: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          referred_user_id: string
          level: number
          status: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          referred_user_id?: string
          level?: number
          status?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      user_ranks: {
        Row: {
          id: string
          user_id: string
          rank: string
          bonus_rate: string
          progress: number
          target: string
          earned: string
          required_referrals: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          rank: string
          bonus_rate: string
          progress: number
          target: string
          earned: string
          required_referrals?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          rank?: string
          bonus_rate?: string
          progress?: number
          target?: string
          earned?: string
          required_referrals?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          exchange: string
          api_key: string
          api_secret: string
          is_testnet: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          exchange: string
          api_key: string
          api_secret: string
          is_testnet?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          exchange?: string
          api_key?: string
          api_secret?: string
          is_testnet?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
    }
  }
}
