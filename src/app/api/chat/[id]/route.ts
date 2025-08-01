import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabase-server";
import { ChatsServer } from "@/services/Chats";
import { MessagesServer } from "@/services/Messages";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabase();
    const { id: chatId } = await params;

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

    // Verify chat exists and belongs to user using service
    let chat;
    try {
      chat = await ChatsServer.getByIdAndUserId(chatId, user.id);
    } catch (error) {
      console.error("Chat not found or access denied:", error);
      return NextResponse.json(
        { error: "Conversación no encontrada" },
        { status: 404 }
      );
    }

    // Get all messages for this chat using service
    const messages = await MessagesServer.getByChatId(chatId, {
      orderBy: "created_at",
      ascending: true
    });

    // Return chat object with embedded messages
    return NextResponse.json({
      success: true,
      data: {
        id: chat.id,
        title: chat.title,
        created_at: chat.created_at,
        updated_at: chat.updated_at,
        messages: messages.map((message) => ({
          id: message.id,
          content: message.content,
          role: message.role,
          tokens: message.token_count,
          model: message.model,
          created_at: message.created_at,
        })),
      },
    });

  } catch (error: any) {
    console.error("Error loading chat:", error);

    // Handle Supabase/database errors
    if (error.message?.includes("permission") || error.message?.includes("policy")) {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a esta conversación" },
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