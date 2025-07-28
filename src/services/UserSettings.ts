import { createClientSupabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type UserSettings = Database['public']['Tables']['user_settings']['Row']
type UserSettingsInsert = Database['public']['Tables']['user_settings']['Insert']
type UserSettingsUpdate = Database['public']['Tables']['user_settings']['Update']

export const UserSettings = {
  /**
   * Crear configuraciones de usuario
   */
  async create(data: UserSettingsInsert): Promise<UserSettings> {
    const supabase = createClientSupabase()
    
    const { data: settings, error } = await supabase
      .from('user_settings')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return settings
  },

  /**
   * Obtener configuraciones del usuario actual
   */
  async getCurrent(): Promise<UserSettings | null> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return settings || null
  },

  /**
   * Obtener o crear configuraciones usando la función de BD
   */
  async getOrCreate(): Promise<UserSettings> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data: settings, error } = await supabase
      .rpc('get_or_create_user_settings', { p_user_id: user.id })

    if (error) throw error
    return settings
  },

  /**
   * Actualizar configuraciones del usuario actual
   */
  async updateCurrent(data: UserSettingsUpdate): Promise<UserSettings> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data: settings, error } = await supabase
      .from('user_settings')
      .update(data)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return settings
  },

  /**
   * Actualizar tema
   */
  async updateTheme(theme: 'light' | 'dark' | 'system'): Promise<UserSettings> {
    return this.updateCurrent({ theme })
  },

  /**
   * Actualizar idioma
   */
  async updateLanguage(language: string): Promise<UserSettings> {
    return this.updateCurrent({ language })
  },

  /**
   * Actualizar modelo por defecto
   */
  async updateDefaultModel(model: string): Promise<UserSettings> {
    return this.updateCurrent({ default_model: model })
  },

  /**
   * Actualizar múltiples configuraciones a la vez
   */
  async updateMultiple(updates: {
    theme?: 'light' | 'dark' | 'system'
    language?: string
    defaultModel?: string
  }): Promise<UserSettings> {
    const updateData: UserSettingsUpdate = {}
    
    if (updates.theme) updateData.theme = updates.theme
    if (updates.language) updateData.language = updates.language
    if (updates.defaultModel) updateData.default_model = updates.defaultModel

    return this.updateCurrent(updateData)
  },

  /**
   * Resetear configuraciones a valores por defecto
   */
  async resetToDefaults(): Promise<UserSettings> {
    return this.updateCurrent({
      theme: 'system',
      language: 'es',
      default_model: 'gpt-4o-mini'
    })
  },

  /**
   * Eliminar configuraciones (volverán a valores por defecto)
   */
  async delete(): Promise<boolean> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { error } = await supabase
      .from('user_settings')
      .delete()
      .eq('user_id', user.id)

    if (error) throw error
    return true
  },

  /**
   * Obtener configuraciones con valores por defecto garantizados
   */
  async getCurrentWithDefaults(): Promise<UserSettings> {
    const settings = await this.getCurrent()
    
    if (settings) return settings

    // Si no existen configuraciones, usar la función get_or_create
    return this.getOrCreate()
  }
}