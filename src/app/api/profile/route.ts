import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabase-server";
import { Profiles } from "@/services/Profiles";

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const profile = await Profiles.getCurrent();
    
    return NextResponse.json({ profile, user });
  } catch (error) {
    console.error("Error getting profile:", error);
    return NextResponse.json(
      { error: "Error al obtener el perfil" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, avatar_url } = body;

    const result = await Profiles.updateProfileWithAuth({
      full_name,
      avatar_url,
    });

    // Refrescar la sesión para obtener los datos actualizados
    await supabase.auth.refreshSession();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Error al actualizar el perfil" },
      { status: 500 }
    );
  }
}