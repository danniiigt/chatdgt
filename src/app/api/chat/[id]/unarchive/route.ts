import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabase-server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const chatId = resolvedParams.id;

    if (!chatId) {
      return NextResponse.json(
        { error: "ID de chat requerido" },
        { status: 400 }
      );
    }

    // Verify chat exists and belongs to user
    const { data: existingChat, error: findError } = await supabase
      .from("chats")
      .select("*")
      .eq("id", chatId)
      .eq("user_id", user.id)
      .single();

    if (findError || !existingChat) {
      return NextResponse.json(
        { error: "Chat no encontrado" },
        { status: 404 }
      );
    }

    // Update chat to unarchive it
    const { data: updatedChat, error: updateError } = await supabase
      .from("chats")
      .update({ is_archived: false })
      .eq("id", chatId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error unarchiving chat:", updateError);
      return NextResponse.json(
        { error: "Error al restaurar el chat" },
        { status: 500 }
      );
    }

    return NextResponse.json({ chat: updatedChat });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}