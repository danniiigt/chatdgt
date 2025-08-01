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

    // Get pagination parameters from query string
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100); // Max 100 messages per request
    const offset = (page - 1) * limit;

    // Get messages with pagination using service
    const messages = await MessagesServer.getByChatId(chatId, {
      limit,
      offset,
      orderBy: "created_at",
      ascending: true
    });

    // Get total count for pagination info by getting all messages count
    const allMessages = await MessagesServer.getByChatId(chatId);
    const totalMessagesCount = allMessages.length;
    const totalPages = Math.ceil(totalMessagesCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        chat: {
          id: chat.id,
          title: chat.title,
          created_at: chat.created_at,
          updated_at: chat.updated_at,
        },
        messages: messages.map((message) => ({
          id: message.id,
          content: message.content,
          role: message.role,
          tokens: message.token_count,
          model: message.model,
          created_at: message.created_at,
        })),
        pagination: {
          page,
          limit,
          total: totalMessagesCount,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
      },
    });

  } catch (error: any) {
    console.error("Error loading chat messages:", error);

    // Handle Supabase/database errors
    if (error.message?.includes("permission") || error.message?.includes("policy")) {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a estos mensajes" },
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