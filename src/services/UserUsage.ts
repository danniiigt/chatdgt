import { createClientSupabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type UserUsage = Database['public']['Tables']['user_usage']['Row']
type UserUsageInsert = Database['public']['Tables']['user_usage']['Insert']
type UserUsageUpdate = Database['public']['Tables']['user_usage']['Update']

export const UserUsage = {
  /**
   * Crear registro de uso para un usuario
   */
  async create(data: UserUsageInsert): Promise<UserUsage> {
    const supabase = createClientSupabase()
    
    const { data: usage, error } = await supabase
      .from('user_usage')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return usage
  },

  /**
   * Obtener uso actual del usuario logueado
   */
  async getCurrent(): Promise<UserUsage | null> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: usage, error } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return usage || null
  },

  /**
   * Obtener o crear registro de uso usando la función de BD
   */
  async getOrCreate(): Promise<UserUsage> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    // Intentar obtener existente
    const existing = await this.getCurrent()
    if (existing) return existing

    // Si no existe, crear uno nuevo
    return this.create({ user_id: user.id })
  },

  /**
   * Incrementar uso usando la función de BD
   */
  async increment(messages: number = 0, tokens: number = 0): Promise<UserUsage> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data: usage, error } = await supabase
      .rpc('increment_user_usage', {
        p_user_id: user.id,
        p_messages: messages,
        p_tokens: tokens
      })

    if (error) throw error
    return usage
  },

  /**
   * Incrementar solo mensajes
   */
  async incrementMessages(count: number = 1): Promise<UserUsage> {
    return this.increment(count, 0)
  },

  /**
   * Incrementar solo tokens
   */
  async incrementTokens(count: number): Promise<UserUsage> {
    return this.increment(0, count)
  },

  /**
   * Resetear uso usando la función de BD
   */
  async reset(): Promise<UserUsage> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data: usage, error } = await supabase
      .rpc('reset_user_usage', { p_user_id: user.id })

    if (error) throw error
    return usage
  },

  /**
   * Actualizar uso manualmente
   */
  async update(data: UserUsageUpdate): Promise<UserUsage> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data: usage, error } = await supabase
      .from('user_usage')
      .update(data)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return usage
  },

  /**
   * Verificar si el usuario ha alcanzado el límite de mensajes
   */
  async hasReachedMessageLimit(limit: number): Promise<boolean> {
    const usage = await this.getCurrent()
    return usage ? usage.total_messages >= limit : false
  },

  /**
   * Verificar si el usuario ha alcanzado el límite de tokens
   */
  async hasReachedTokenLimit(limit: number): Promise<boolean> {
    const usage = await this.getCurrent()
    return usage ? usage.total_tokens >= limit : false
  },

  /**
   * Obtener porcentaje de uso de mensajes
   */
  async getMessageUsagePercentage(limit: number): Promise<number> {
    const usage = await this.getCurrent()
    if (!usage) return 0
    return Math.min((usage.total_messages / limit) * 100, 100)
  },

  /**
   * Obtener porcentaje de uso de tokens
   */
  async getTokenUsagePercentage(limit: number): Promise<number> {
    const usage = await this.getCurrent()
    if (!usage) return 0
    return Math.min((usage.total_tokens / limit) * 100, 100)
  },

  /**
   * Obtener mensajes restantes hasta el límite
   */
  async getRemainingMessages(limit: number): Promise<number> {
    const usage = await this.getCurrent()
    if (!usage) return limit
    return Math.max(limit - usage.total_messages, 0)
  },

  /**
   * Obtener tokens restantes hasta el límite
   */
  async getRemainingTokens(limit: number): Promise<number> {
    const usage = await this.getCurrent()
    if (!usage) return limit
    return Math.max(limit - usage.total_tokens, 0)
  },

  /**
   * Obtener estadísticas completas de uso
   */
  async getStats(messageLimitm: number, tokenLimit: number): Promise<{
    usage: UserUsage | null
    messages: {
      used: number
      remaining: number
      percentage: number
      limitReached: boolean
    }
    tokens: {
      used: number
      remaining: number
      percentage: number
      limitReached: boolean
    }
    resetDate: string | null
  }> {
    const usage = await this.getCurrent()
    
    const messagesUsed = usage?.total_messages || 0
    const tokensUsed = usage?.total_tokens || 0

    return {
      usage,
      messages: {
        used: messagesUsed,
        remaining: Math.max(messageLimitm - messagesUsed, 0),
        percentage: Math.min((messagesUsed / messageLimitm) * 100, 100),
        limitReached: messagesUsed >= messageLimitm
      },
      tokens: {
        used: tokensUsed,
        remaining: Math.max(tokenLimit - tokensUsed, 0),
        percentage: Math.min((tokensUsed / tokenLimit) * 100, 100),
        limitReached: tokensUsed >= tokenLimit
      },
      resetDate: usage?.reset_date || null
    }
  },

  /**
   * Verificar si necesita reseteo (útil para trabajos programados)
   */
  async needsReset(): Promise<boolean> {
    const usage = await this.getCurrent()
    if (!usage) return false

    const resetDate = new Date(usage.reset_date)
    const today = new Date()
    
    // Resetear si la fecha de reset es anterior al día actual
    return resetDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())
  },

  /**
   * Eliminar registro de uso
   */
  async delete(): Promise<boolean> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { error } = await supabase
      .from('user_usage')
      .delete()
      .eq('user_id', user.id)

    if (error) throw error
    return true
  }
}