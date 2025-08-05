import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabase-server";
import { Profiles } from "@/services/Profiles";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    const result = await Profiles.uploadAvatar(file);

    // Refrescar la sesión para obtener los datos actualizados
    await supabase.auth.refreshSession();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Error al subir el avatar" },
      { status: 500 }
    );
  }
}