import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabase-server";
import { ChatsServer } from "@/services/Chats";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    // Get pagination and search parameters from query string
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50); // Max 50 chats per request
    const search = url.searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    // Get chats using service
    const chats = await ChatsServer.getByUserId(user.id, {
      limit,
      offset,
      search: search || undefined,
      orderBy: "updated_at",
      ascending: false,
    });

    // Get total count using service
    const totalCount = await ChatsServer.getCountByUserId(
      user.id,
      search || undefined
    );
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Format response with additional metadata
    const formattedChats = chats.map((chat) => ({
      id: chat.id,
      title: chat.title,
      created_at: chat.created_at,
      updated_at: chat.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: {
        chats: formattedChats,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
        search: search || null,
      },
    });
  } catch (error: any) {
    console.error("Error loading user chats:", error);

    // Handle Supabase/database errors
    if (
      error.message?.includes("permission") ||
      error.message?.includes("policy")
    ) {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a las conversaciones" },
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

// DELETE endpoint to delete a specific chat
export async function DELETE(request: NextRequest) {
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

    // Get chatId from request body
    const { chatId } = await request.json();

    if (!chatId) {
      return NextResponse.json(
        { error: "ID de conversación requerido" },
        { status: 400 }
      );
    }

    // Delete the chat using service (includes security checks)
    await ChatsServer.deleteByUserAndId(user.id, chatId);

    return NextResponse.json({
      success: true,
      message: "Conversación eliminada exitosamente",
    });
  } catch (error: any) {
    console.error("Error deleting chat:", error);

    // Handle service errors
    if (error.message === "Conversación no encontrada") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (
      error.message?.includes("permission") ||
      error.message?.includes("policy")
    ) {
      return NextResponse.json(
        { error: "No tienes permisos para eliminar conversaciones" },
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
