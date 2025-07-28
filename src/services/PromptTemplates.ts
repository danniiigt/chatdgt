import { createClientSupabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type PromptTemplate = Database['public']['Tables']['prompt_templates']['Row']
type PromptTemplateInsert = Database['public']['Tables']['prompt_templates']['Insert']
type PromptTemplateUpdate = Database['public']['Tables']['prompt_templates']['Update']

export const PromptTemplates = {
  /**
   * Crear una nueva plantilla
   */
  async create(data: PromptTemplateInsert): Promise<PromptTemplate> {
    const supabase = createClientSupabase()
    
    const { data: template, error } = await supabase
      .from('prompt_templates')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return template
  },

  /**
   * Crear plantilla simple (solo título y contenido)
   */
  async createSimple(title: string, content: string, category?: string, isPublic: boolean = false): Promise<PromptTemplate> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    return this.create({
      user_id: user.id,
      title,
      content,
      category: category || null,
      is_public: isPublic
    })
  },

  /**
   * Obtener todas las plantillas del usuario actual
   */
  async getAllOwn(): Promise<PromptTemplate[]> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: templates, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return templates || []
  },

  /**
   * Obtener plantillas públicas
   */
  async getAllPublic(): Promise<PromptTemplate[]> {
    const supabase = createClientSupabase()
    
    const { data: templates, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return templates || []
  },

  /**
   * Obtener plantillas por categoría
   */
  async getByCategory(category: string, includePublic: boolean = false): Promise<PromptTemplate[]> {
    const supabase = createClientSupabase()
    
    let query = supabase
      .from('prompt_templates')
      .select('*')
      .eq('category', category)
      .order('updated_at', { ascending: false })

    if (includePublic) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        query = query.or(`user_id.eq.${user.id},is_public.eq.true`)
      } else {
        query = query.eq('is_public', true)
      }
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      query = query.eq('user_id', user.id)
    }

    const { data: templates, error } = await query

    if (error) throw error
    return templates || []
  },

  /**
   * Obtener una plantilla por ID
   */
  async getById(id: string): Promise<PromptTemplate> {
    const supabase = createClientSupabase()
    
    const { data: template, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return template
  },

  /**
   * Actualizar una plantilla
   */
  async update(id: string, data: PromptTemplateUpdate): Promise<PromptTemplate> {
    const supabase = createClientSupabase()
    
    const { data: template, error } = await supabase
      .from('prompt_templates')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return template
  },

  /**
   * Eliminar una plantilla
   */
  async delete(id: string): Promise<boolean> {
    const supabase = createClientSupabase()
    
    const { error } = await supabase
      .from('prompt_templates')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  /**
   * Hacer una plantilla pública
   */
  async makePublic(id: string): Promise<PromptTemplate> {
    return this.update(id, { is_public: true })
  },

  /**
   * Hacer una plantilla privada
   */
  async makePrivate(id: string): Promise<PromptTemplate> {
    return this.update(id, { is_public: false })
  },

  /**
   * Buscar plantillas por título o contenido
   */
  async search(query: string, includePublic: boolean = false): Promise<PromptTemplate[]> {
    const supabase = createClientSupabase()
    
    let dbQuery = supabase
      .from('prompt_templates')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('updated_at', { ascending: false })

    if (includePublic) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        dbQuery = dbQuery.or(`user_id.eq.${user.id},is_public.eq.true`)
      } else {
        dbQuery = dbQuery.eq('is_public', true)
      }
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      dbQuery = dbQuery.eq('user_id', user.id)
    }

    const { data: templates, error } = await dbQuery

    if (error) throw error
    return templates || []
  },

  /**
   * Obtener categorías únicas del usuario
   */
  async getOwnCategories(): Promise<string[]> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: templates, error } = await supabase
      .from('prompt_templates')
      .select('category')
      .eq('user_id', user.id)
      .not('category', 'is', null)

    if (error) throw error
    
    const categories = [...new Set((templates || []).map(t => t.category).filter(Boolean))]
    return categories as string[]
  },

  /**
   * Obtener todas las categorías (propias + públicas)
   */
  async getAllCategories(): Promise<string[]> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    let query = supabase
      .from('prompt_templates')
      .select('category')
      .not('category', 'is', null)

    if (user) {
      query = query.or(`user_id.eq.${user.id},is_public.eq.true`)
    } else {
      query = query.eq('is_public', true)
    }

    const { data: templates, error } = await query

    if (error) throw error
    
    const categories = [...new Set((templates || []).map(t => t.category).filter(Boolean))]
    return categories as string[]
  },

  /**
   * Duplicar una plantilla pública para uso personal
   */
  async duplicate(templateId: string, newTitle?: string): Promise<PromptTemplate> {
    const originalTemplate = await this.getById(templateId)
    
    const supabase = createClientSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    return this.create({
      user_id: user.id,
      title: newTitle || `${originalTemplate.title} (Copia)`,
      content: originalTemplate.content,
      category: originalTemplate.category,
      is_public: false
    })
  },

  /**
   * Contar plantillas del usuario
   */
  async getOwnCount(): Promise<number> {
    const supabase = createClientSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    const { count, error } = await supabase
      .from('prompt_templates')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (error) throw error
    return count || 0
  }
}