import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabase-server";
import { Chats, Messages } from "@/services";

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

    // Verify chat exists and belongs to user - use server client directly
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .select("*")
      .eq("id", chatId)
      .eq("user_id", user.id) // Security: ensure user owns the chat
      .single();
    
    if (chatError || !chat) {
      console.error("Chat not found or access denied:", chatError);
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

    // Get messages with pagination - use server client directly
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true })
      .range(offset, offset + limit - 1);
      
    if (messagesError) {
      console.error("Error loading messages:", messagesError);
      throw messagesError;
    }

    // Get total count for pagination info
    const { count: totalMessages, error: countError } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("chat_id", chatId);
      
    if (countError) {
      console.error("Error counting messages:", countError);
      throw countError;
    }
    const totalMessagesCount = totalMessages || 0;
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
        messages: (messages || []).map((message) => ({
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