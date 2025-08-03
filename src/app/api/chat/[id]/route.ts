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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabase();
    const { id: chatId } = await params;
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

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

    // Handle archive action
    if (action === 'archive') {
      try {
        // Verify chat exists and belongs to user
        await ChatsServer.getByIdAndUserId(chatId, user.id);
        
        // Archive chat using service
        await ChatsServer.update(chatId, { is_archived: true });

        return NextResponse.json({
          success: true,
          message: "Conversación archivada correctamente",
        });
      } catch (error: any) {
        console.error("Error archiving chat:", error);
        
        if (error.message?.includes("no encontrada")) {
          return NextResponse.json(
            { error: "Conversación no encontrada" },
            { status: 404 }
          );
        }
        
        return NextResponse.json(
          { error: "Error interno del servidor" },
          { status: 500 }
        );
      }
    }

    // Default behavior: permanent delete
    await ChatsServer.deleteByUserAndId(user.id, chatId);

    return NextResponse.json({
      success: true,
      message: "Conversación eliminada correctamente",
    });

  } catch (error: any) {
    console.error("Error deleting chat:", error);

    // Handle not found errors
    if (error.message?.includes("no encontrada")) {
      return NextResponse.json(
        { error: "Conversación no encontrada" },
        { status: 404 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabase();
    const { id: chatId } = await params;
    const body = await request.json();

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

    // Validate request body
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json(
        { error: "El título es requerido" },
        { status: 400 }
      );
    }

    // Verify chat exists and belongs to user
    try {
      await ChatsServer.getByIdAndUserId(chatId, user.id);
    } catch (error) {
      console.error("Chat not found or access denied:", error);
      return NextResponse.json(
        { error: "Conversación no encontrada" },
        { status: 404 }
      );
    }

    // Update chat title using service
    const updatedChat = await ChatsServer.update(chatId, {
      title: body.title.trim(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Título actualizado correctamente",
      data: {
        id: updatedChat.id,
        title: updatedChat.title,
        updated_at: updatedChat.updated_at,
      },
    });

  } catch (error: any) {
    console.error("Error updating chat title:", error);

    // Handle not found errors
    if (error.message?.includes("no encontrada")) {
      return NextResponse.json(
        { error: "Conversación no encontrada" },
        { status: 404 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}