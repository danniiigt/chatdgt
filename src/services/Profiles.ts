import { createClientSupabase } from "@/lib/supabase/supabase";
import type { Database } from "@/lib/supabase/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export const Profiles = {
  /**
   * Crear un nuevo perfil (generalmente después del registro)
   */
  async create(data: ProfileInsert): Promise<Profile> {
    const supabase = createClientSupabase();

    const { data: profile, error } = await supabase
      .from("profiles")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  /**
   * Obtener el perfil del usuario actual
   */
  async getCurrent(): Promise<Profile | null> {
    const supabase = createClientSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows found
    return profile || null;
  },

  /**
   * Obtener un perfil por su ID
   */
  async getById(id: string): Promise<Profile> {
    const supabase = createClientSupabase();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return profile;
  },

  /**
   * Actualizar el perfil del usuario actual
   */
  async updateCurrent(data: ProfileUpdate): Promise<Profile> {
    const supabase = createClientSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  /**
   * Actualizar un perfil específico por ID
   */
  async update(id: string, data: ProfileUpdate): Promise<Profile> {
    const supabase = createClientSupabase();

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  /**
   * Eliminar un perfil
   */
  async delete(id: string): Promise<boolean> {
    const supabase = createClientSupabase();

    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  /**
   * Obtener o crear perfil (útil después del login)
   */
  async getOrCreate(userData: { id: string; email: string }): Promise<Profile> {
    const supabase = createClientSupabase();

    // Intentar obtener perfil existente
    const { data: existingProfile, error: selectError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.id)
      .single();

    if (existingProfile) return existingProfile;

    // Si no existe, crear uno nuevo
    if (selectError?.code === "PGRST116") {
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userData.id,
          email: userData.email,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return newProfile;
    }

    throw selectError;
  },

  /**
   * Actualizar nombre completo
   */
  async updateFullName(fullName: string): Promise<Profile> {
    return this.updateCurrent({ full_name: fullName });
  },

  /**
   * Actualizar avatar
   */
  async updateAvatar(avatarUrl: string): Promise<Profile> {
    return this.updateCurrent({ avatar_url: avatarUrl });
  },

  /**
   * Actualizar email
   */
  async updateEmail(email: string): Promise<Profile> {
    return this.updateCurrent({ email });
  },

  /**
   * Verificar si un perfil existe
   */
  async exists(id: string): Promise<boolean> {
    const supabase = createClientSupabase();

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return !!data;
  },

  /**
   * Buscar perfiles por email (para funciones admin)
   */
  async searchByEmail(email: string): Promise<Profile[]> {
    const supabase = createClientSupabase();

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("email", `%${email}%`)
      .limit(10);

    if (error) throw error;
    return profiles || [];
  },

  /**
   * Obtener información completa del perfil actual con datos de auth
   */
  async getCurrentWithAuth(): Promise<{
    profile: Profile | null;
    user: any | null;
  }> {
    const supabase = createClientSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { profile: null, user: null };

    const profile = await this.getCurrent();

    return {
      profile,
      user,
    };
  },

  /**
   * Sincronizar datos del perfil con los datos de autenticación
   */
  async syncWithAuth(): Promise<Profile | null> {
    const supabase = createClientSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    // Obtener datos más recientes del usuario de auth
    const email = user.email || "";
    const fullName =
      user.user_metadata?.full_name || user.user_metadata?.name || null;

    // Actualizar o crear perfil con datos de auth
    const profile = await this.getOrCreate({
      id: user.id,
      email,
    });

    // Actualizar información adicional si está disponible
    if (fullName && fullName !== profile.full_name) {
      return this.update(user.id, {
        full_name: fullName,
        email,
      });
    }

    return profile;
  },

  /**
   * Actualizar perfil completo y sincronizar con auth
   */
  async updateProfileWithAuth(data: {
    full_name?: string;
    avatar_url?: string;
  }): Promise<{ profile: Profile; user: any }> {
    const supabase = createClientSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    // Actualizar perfil en BD
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email!,
        full_name: data.full_name || null,
        avatar_url: data.avatar_url || null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) throw profileError;

    // Actualizar user_metadata en Auth
    const { error: userError, data: updatedUser } = await supabase.auth.updateUser({
      data: {
        full_name: data.full_name || null,
        avatar_url: data.avatar_url || null,
      },
    });

    if (userError) throw userError;

    return { profile, user: updatedUser.user };
  },

  /**
   * Subir avatar y actualizar perfil
   */
  async uploadAvatar(file: File): Promise<{ profile: Profile; user: any; avatarUrl: string }> {
    const supabase = createClientSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    // Subir archivo
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const avatarUrl = data.publicUrl;

    // Actualizar perfil con nuevo avatar
    const result = await this.updateProfileWithAuth({
      avatar_url: avatarUrl,
    });

    return { ...result, avatarUrl };
  },
};
