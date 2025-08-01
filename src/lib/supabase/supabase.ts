import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente para componentes del cliente
export const createClientSupabase = () => {
  return createClientComponentClient()
}

// Cliente básico (para casos específicos)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de la base de datos
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          title: string
          user_id: string
          system_prompt: string | null
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title?: string
          user_id: string
          system_prompt?: string | null
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          user_id?: string
          system_prompt?: string | null
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          content: string
          role: 'user' | 'assistant' | 'system'
          model: string | null
          token_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          content: string
          role: 'user' | 'assistant' | 'system'
          model?: string | null
          token_count?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          content?: string
          role?: 'user' | 'assistant' | 'system'
          model?: string | null
          token_count?: number | null
          created_at?: string
        }
      }
      shared_chats: {
        Row: {
          id: string
          chat_id: string
          share_token: string
          is_active: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          share_token?: string
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          share_token?: string
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          theme: 'light' | 'dark' | 'system'
          language: string
          default_model: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: 'light' | 'dark' | 'system'
          language?: string
          default_model?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: 'light' | 'dark' | 'system'
          language?: string
          default_model?: string
          created_at?: string
          updated_at?: string
        }
      }
      chat_bookmarks: {
        Row: {
          id: string
          user_id: string
          chat_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          chat_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          chat_id?: string
          created_at?: string
        }
      }
      prompt_templates: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          category: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          category?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          category?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_usage: {
        Row: {
          id: string
          user_id: string
          total_messages: number
          total_tokens: number
          reset_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_messages?: number
          total_tokens?: number
          reset_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_messages?: number
          total_tokens?: number
          reset_date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_shared_chat_valid: {
        Args: {
          token: string
        }
        Returns: boolean
      }
      get_or_create_user_settings: {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: string
          user_id: string
          theme: 'light' | 'dark' | 'system'
          language: string
          default_model: string
          created_at: string
          updated_at: string
        }
      }
      increment_user_usage: {
        Args: {
          p_user_id: string
          p_messages?: number
          p_tokens?: number
        }
        Returns: {
          id: string
          user_id: string
          total_messages: number
          total_tokens: number
          reset_date: string
          created_at: string
          updated_at: string
        }
      }
      reset_user_usage: {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: string
          user_id: string
          total_messages: number
          total_tokens: number
          reset_date: string
          created_at: string
          updated_at: string
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}