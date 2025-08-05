import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabase-server";

export async function GET() {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    // Usar directamente la función de Supabase en lugar del servicio
    const { data: settings, error } = await supabase.rpc(
      "get_or_create_user_settings",
      { p_user_id: user.id }
    );

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { theme, language, default_model } = body;

    // Validar datos de entrada
    const updateData: Record<string, any> = {};
    
    if (theme && ["light", "dark", "system"].includes(theme)) {
      updateData.theme = theme;
    }
    
    if (language && typeof language === "string") {
      updateData.language = language;
    }
    
    if (default_model && typeof default_model === "string") {
      updateData.default_model = default_model;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No hay datos válidos para actualizar" },
        { status: 400 }
      );
    }

    // Actualizar directamente usando Supabase
    const { data: settings, error: updateError } = await supabase
      .from("user_settings")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // También actualizar user_metadata en Auth
    const { error: authUpdateError } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        settings: updateData,
      },
    });

    if (authUpdateError) {
      console.error("Error updating user metadata:", authUpdateError);
      // No lanzamos error aquí para no fallar toda la operación si solo falla el metadata
    }

    return NextResponse.json({ 
      data: settings,
      message: "Configuración actualizada correctamente" 
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}