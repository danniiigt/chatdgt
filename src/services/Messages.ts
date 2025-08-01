import { createClientSupabase } from "@/lib/supabase/supabase";
import type { Database } from "@/lib/supabase/supabase";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];
type MessageUpdate = Database["public"]["Tables"]["messages"]["Update"];

export const Messages = {
  /**
   * Crear un nuevo mensaje en un chat
   */
  async create(data: MessageInsert): Promise<Message> {
    const supabase = createClientSupabase();

    const { data: message, error } = await supabase
      .from("messages")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return message;
  },

  /**
   * Obtener todos los mensajes de un chat específico (mantenido para compatibilidad)
   */
  async getByChatId(
    chatId: string,
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: keyof Message;
      ascending?: boolean;
    }
  ): Promise<Message[]> {
    const supabase = createClientSupabase();
    const {
      limit = 1000, // Valor alto para compatibilidad con código existente
      offset = 0,
      orderBy = "created_at",
      ascending = true,
    } = options || {};

    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order(orderBy as string, { ascending })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return messages || [];
  },

  /**
   * Obtener un mensaje por su ID
   */
  async getById(id: string): Promise<Message> {
    const supabase = createClientSupabase();

    const { data: message, error } = await supabase
      .from("messages")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return message;
  },

  /**
   * Actualizar un mensaje existente
   */
  async update(id: string, data: MessageUpdate): Promise<Message> {
    const supabase = createClientSupabase();

    const { data: message, error } = await supabase
      .from("messages")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return message;
  },

  /**
   * Eliminar un mensaje
   */
  async delete(id: string): Promise<boolean> {
    const supabase = createClientSupabase();

    const { error } = await supabase.from("messages").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  /**
   * Obtener el último mensaje de un chat
   */
  async getLastMessage(chatId: string): Promise<Message | null> {
    const supabase = createClientSupabase();

    const { data: message, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows found
    return message || null;
  },

  /**
   * Contar mensajes de usuario en un chat (para límites)
   */
  async countUserMessages(chatId: string): Promise<number> {
    const supabase = createClientSupabase();

    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("chat_id", chatId)
      .eq("role", "user");

    if (error) throw error;
    return count || 0;
  },

  /**
   * Obtener total de tokens utilizados en un chat
   */
  async getTotalTokens(chatId: string): Promise<number> {
    const supabase = createClientSupabase();

    const { data: messages, error } = await supabase
      .from("messages")
      .select("token_count")
      .eq("chat_id", chatId)
      .not("token_count", "is", null);

    if (error) throw error;

    const totalTokens =
      messages?.reduce((sum, msg) => sum + (msg.token_count || 0), 0) || 0;
    return totalTokens;
  },

  /**
   * Buscar mensajes por contenido (útil para búsquedas)
   */
  async searchInChat(chatId: string, query: string): Promise<Message[]> {
    const supabase = createClientSupabase();

    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .textSearch("content", query)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return messages || [];
  },


  /**
   * Contar mensajes por chat ID
   */
  async getCountByChatId(chatId: string): Promise<number> {
    const supabase = createClientSupabase();

    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("chat_id", chatId);

    if (error) throw error;
    return count || 0;
  },
};
