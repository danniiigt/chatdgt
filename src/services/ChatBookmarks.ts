import { createClientSupabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type ChatBookmark = Database['public']['Tables']['chat_bookmarks']['Row']
type ChatBookmarkInsert = Database['public']['Tables']['chat_bookmarks']['Insert']

// Tipo extendido para bookmark con información del chat
type BookmarkWithChat = ChatBookmark & {
  chat: {
    id: string
    title: string
    created_at: string
    updated_at: string
  }
}

export const ChatBookmarks = {
  /**
   * Crear un nuevo favorito
   */
  async create(data: ChatBookmarkInsert): Promise<ChatBookmark> {
    const supabase = createClientSupabase()
    
    const { data: bookmark, error } = await supabase
      .from('chat_bookmarks')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return bookmark
  },

  /**
   * Marcar un chat como favorito
   */
  async addBookmark(chatId: string): Promise<ChatBookmark> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    return this.create({
      user_id: user.id,
      chat_id: chatId
    })
  },

  /**
   * Quitar un chat de favoritos
   */
  async removeBookmark(chatId: string): Promise<boolean> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { error } = await supabase
      .from('chat_bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('chat_id', chatId)

    if (error) throw error
    return true
  },

  /**
   * Alternar favorito (agregar si no existe, quitar si existe)
   */
  async toggleBookmark(chatId: string): Promise<{ bookmarked: boolean }> {
    const isBookmarked = await this.isBookmarked(chatId)
    
    if (isBookmarked) {
      await this.removeBookmark(chatId)
      return { bookmarked: false }
    } else {
      await this.addBookmark(chatId)
      return { bookmarked: true }
    }
  },

  /**
   * Verificar si un chat está marcado como favorito
   */
  async isBookmarked(chatId: string): Promise<boolean> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data, error } = await supabase
      .from('chat_bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('chat_id', chatId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return !!data
  },

  /**
   * Obtener todos los favoritos del usuario actual
   */
  async getAll(): Promise<ChatBookmark[]> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: bookmarks, error } = await supabase
      .from('chat_bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return bookmarks || []
  },

  /**
   * Obtener favoritos con información completa del chat
   */
  async getAllWithChats(): Promise<BookmarkWithChat[]> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: bookmarks, error } = await supabase
      .from('chat_bookmarks')
      .select(`
        *,
        chats!chat_bookmarks_chat_id_fkey (
          id,
          title,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    return (bookmarks || []).map((bookmark: any) => ({
      ...bookmark,
      chat: bookmark.chats
    }))
  },

  /**
   * Obtener IDs de todos los chats favoritos (útil para marcar en la UI)
   */
  async getBookmarkedChatIds(): Promise<string[]> {
    const bookmarks = await this.getAll()
    return bookmarks.map(bookmark => bookmark.chat_id)
  },

  /**
   * Contar total de favoritos del usuario
   */
  async getCount(): Promise<number> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    const { count, error } = await supabase
      .from('chat_bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (error) throw error
    return count || 0
  },

  /**
   * Eliminar un favorito por su ID
   */
  async delete(id: string): Promise<boolean> {
    const supabase = createClientSupabase()
    
    const { error } = await supabase
      .from('chat_bookmarks')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  /**
   * Limpiar todos los favoritos del usuario
   */
  async clearAll(): Promise<boolean> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { error } = await supabase
      .from('chat_bookmarks')
      .delete()
      .eq('user_id', user.id)

    if (error) throw error
    return true
  }
}