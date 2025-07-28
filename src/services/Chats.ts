import { createClientSupabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Chat = Database['public']['Tables']['chats']['Row']
type ChatInsert = Database['public']['Tables']['chats']['Insert']
type ChatUpdate = Database['public']['Tables']['chats']['Update']

// Tipo extendido para chat con información adicional
type ChatWithLastMessage = Chat & {
  last_message?: {
    content: string
    role: 'user' | 'assistant' | 'system'
    created_at: string
  } | null
  message_count?: number
}

export const Chats = {
  /**
   * Crear un nuevo chat
   */
  async create(data: ChatInsert): Promise<Chat> {
    const supabase = createClientSupabase()
    
    const { data: chat, error } = await supabase
      .from('chats')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return chat
  },

  /**
   * Obtener todos los chats del usuario actual
   */
  async getAll(): Promise<Chat[]> {
    const supabase = createClientSupabase()
    
    const { data: chats, error } = await supabase
      .from('chats')
      .select('*')
      .eq('is_archived', false)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return chats || []
  },

  /**
   * Obtener chats archivados del usuario
   */
  async getArchived(): Promise<Chat[]> {
    const supabase = createClientSupabase()
    
    const { data: chats, error } = await supabase
      .from('chats')
      .select('*')
      .eq('is_archived', true)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return chats || []
  },

  /**
   * Obtener un chat por su ID
   */
  async getById(id: string): Promise<Chat> {
    const supabase = createClientSupabase()
    
    const { data: chat, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return chat
  },

  /**
   * Obtener chats con información del último mensaje (para sidebar)
   */
  async getAllWithLastMessage(): Promise<ChatWithLastMessage[]> {
    const supabase = createClientSupabase()
    
    const { data: chats, error } = await supabase
      .from('chats')
      .select(`
        *,
        messages!messages_chat_id_fkey (
          content,
          role,
          created_at
        )
      `)
      .eq('is_archived', false)
      .order('updated_at', { ascending: false })

    if (error) throw error

    // Procesar para obtener solo el último mensaje de cada chat
    const chatsWithLastMessage: ChatWithLastMessage[] = (chats || []).map((chat: any) => {
      const messages = chat.messages || []
      const lastMessage = messages.length > 0 
        ? messages[messages.length - 1] 
        : null

      return {
        ...chat,
        last_message: lastMessage,
        message_count: messages.length,
        messages: undefined // Remover el array completo
      }
    })

    return chatsWithLastMessage
  },

  /**
   * Actualizar un chat
   */
  async update(id: string, data: ChatUpdate): Promise<Chat> {
    const supabase = createClientSupabase()
    
    const { data: chat, error } = await supabase
      .from('chats')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return chat
  },

  /**
   * Eliminar un chat permanentemente
   */
  async delete(id: string): Promise<boolean> {
    const supabase = createClientSupabase()
    
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  /**
   * Archivar un chat (soft delete)
   */
  async archive(id: string): Promise<Chat> {
    return this.update(id, { is_archived: true })
  },

  /**
   * Desarchivar un chat
   */
  async unarchive(id: string): Promise<Chat> {
    return this.update(id, { is_archived: false })
  },

  /**
   * Actualizar el título de un chat
   */
  async updateTitle(id: string, title: string): Promise<Chat> {
    return this.update(id, { title })
  },

  /**
   * Actualizar el prompt del sistema de un chat
   */
  async updateSystemPrompt(id: string, systemPrompt: string | null): Promise<Chat> {
    return this.update(id, { system_prompt: systemPrompt })
  },

  /**
   * Obtener estadísticas básicas de chats del usuario
   */
  async getStats(): Promise<{
    total: number
    archived: number
    active: number
  }> {
    const supabase = createClientSupabase()
    
    const [
      { count: total },
      { count: archived }
    ] = await Promise.all([
      supabase
        .from('chats')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .eq('is_archived', true)
    ])

    return {
      total: total || 0,
      archived: archived || 0,
      active: (total || 0) - (archived || 0)
    }
  },

  /**
   * Buscar chats por título
   */
  async searchByTitle(query: string): Promise<Chat[]> {
    const supabase = createClientSupabase()
    
    const { data: chats, error } = await supabase
      .from('chats')
      .select('*')
      .textSearch('title', query)
      .eq('is_archived', false)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return chats || []
  },

  /**
   * Obtener chats recientes (últimos N chats)
   */
  async getRecent(limit: number = 10): Promise<Chat[]> {
    const supabase = createClientSupabase()
    
    const { data: chats, error } = await supabase
      .from('chats')
      .select('*')
      .eq('is_archived', false)
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return chats || []
  }
}