import { createClientSupabase } from "@/lib/supabase/supabase";
import type { Database } from "@/lib/supabase/supabase";

type SharedChat = Database["public"]["Tables"]["shared_chats"]["Row"];
type SharedChatInsert = Database["public"]["Tables"]["shared_chats"]["Insert"];
type SharedChatUpdate = Database["public"]["Tables"]["shared_chats"]["Update"];

export const SharedChats = {
  /**
   * Crear un enlace compartido para un chat
   */
  async create(data: SharedChatInsert): Promise<SharedChat> {
    const supabase = createClientSupabase();

    const { data: sharedChat, error } = await supabase
      .from("shared_chats")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return sharedChat;
  },

  /**
   * Crear enlace compartido simple (solo necesita chat_id)
   */
  async createForChat(chatId: string, expiresAt?: string): Promise<SharedChat> {
    return this.create({
      chat_id: chatId,
      expires_at: expiresAt || null,
    });
  },

  /**
   * Obtener información de un chat compartido por token
   */
  async getByToken(token: string): Promise<SharedChat | null> {
    const supabase = createClientSupabase();

    const { data: sharedChat, error } = await supabase
      .from("shared_chats")
      .select("*")
      .eq("share_token", token)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return sharedChat || null;
  },

  /**
   * Obtener enlace compartido de un chat específico
   */
  async getByChatId(chatId: string): Promise<SharedChat | null> {
    const supabase = createClientSupabase();

    const { data: sharedChat, error } = await supabase
      .from("shared_chats")
      .select("*")
      .eq("chat_id", chatId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return sharedChat || null;
  },

  /**
   * Verificar si un token es válido usando la función de BD
   */
  async isValidToken(token: string): Promise<boolean> {
    const supabase = createClientSupabase();

    const { data, error } = await supabase.rpc("is_shared_chat_valid", {
      token,
    });

    if (error) throw error;
    return data || false;
  },

  /**
   * Actualizar configuración de enlace compartido
   */
  async update(id: string, data: SharedChatUpdate): Promise<SharedChat> {
    const supabase = createClientSupabase();

    const { data: sharedChat, error } = await supabase
      .from("shared_chats")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return sharedChat;
  },

  /**
   * Desactivar un enlace compartido
   */
  async deactivate(chatId: string): Promise<SharedChat> {
    const supabase = createClientSupabase();

    const { data: sharedChat, error } = await supabase
      .from("shared_chats")
      .update({ is_active: false })
      .eq("chat_id", chatId)
      .select()
      .single();

    if (error) throw error;
    return sharedChat;
  },

  /**
   * Reactivar un enlace compartido
   */
  async activate(chatId: string): Promise<SharedChat> {
    const supabase = createClientSupabase();

    const { data: sharedChat, error } = await supabase
      .from("shared_chats")
      .update({ is_active: true })
      .eq("chat_id", chatId)
      .select()
      .single();

    if (error) throw error;
    return sharedChat;
  },

  /**
   * Eliminar enlace compartido permanentemente
   */
  async delete(chatId: string): Promise<boolean> {
    const supabase = createClientSupabase();

    const { error } = await supabase
      .from("shared_chats")
      .delete()
      .eq("chat_id", chatId);

    if (error) throw error;
    return true;
  },

  /**
   * Obtener o crear enlace compartido para un chat
   */
  async getOrCreateForChat(
    chatId: string,
    expiresAt?: string
  ): Promise<SharedChat> {
    // Intentar obtener enlace existente
    const existing = await this.getByChatId(chatId);

    if (existing) {
      // Si existe pero está inactivo, reactivarlo
      if (!existing.is_active) {
        return this.activate(chatId);
      }
      return existing;
    }

    // Si no existe, crear uno nuevo
    return this.createForChat(chatId, expiresAt);
  },

  /**
   * Establecer fecha de expiración
   */
  async setExpiration(
    chatId: string,
    expiresAt: string | null
  ): Promise<SharedChat> {
    const supabase = createClientSupabase();

    const { data: sharedChat, error } = await supabase
      .from("shared_chats")
      .update({ expires_at: expiresAt })
      .eq("chat_id", chatId)
      .select()
      .single();

    if (error) throw error;
    return sharedChat;
  },

  /**
   * Obtener todos los enlaces compartidos activos del usuario
   */
  async getAllActive(): Promise<SharedChat[]> {
    const supabase = createClientSupabase();

    const { data: sharedChats, error } = await supabase
      .from("shared_chats")
      .select(
        `
        *,
        chats!shared_chats_chat_id_fkey (
          title,
          created_at
        )
      `
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return sharedChats || [];
  },
};
