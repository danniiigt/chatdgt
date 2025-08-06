import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabase-server";

export async function GET() {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: archivedChats, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_archived", true)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching archived chats:", error);
      return NextResponse.json(
        { error: "Error al obtener chats archivados" },
        { status: 500 }
      );
    }

    return NextResponse.json({ chats: archivedChats || [] });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}