import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabase-server";
import { Chats } from "@/services";

interface NewChatRequest {
  title?: string;
  model?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();

    // Verify user authentication
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

    // Parse request body (optional)
    let body: NewChatRequest = {};
    try {
      body = await request.json();
    } catch {
      // Body is optional for this endpoint
    }

    const { title, model } = body;

    // Create new chat
    const chat = await Chats.create({
      user_id: user.id,
      title: title || "Nueva conversación",
    });

    return NextResponse.json({
      success: true,
      data: {
        id: chat.id,
        title: chat.title,
        created_at: chat.created_at,
        updated_at: chat.updated_at,
      },
    });

  } catch (error: any) {
    console.error("Error creating new chat:", error);

    // Handle Supabase/database errors
    if (error.message?.includes("permission") || error.message?.includes("policy")) {
      return NextResponse.json(
        { error: "No tienes permisos para crear conversaciones" },
        { status: 403 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}