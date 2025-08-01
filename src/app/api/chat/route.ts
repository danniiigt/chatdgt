import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabase-server";

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

    console.log("Authenticated user:", user.id, user.email);

    // Get pagination and search parameters from query string
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50); // Max 50 chats per request
    const search = url.searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    console.log("Query params:", { page, limit, search, offset });

    // Build query - use server client directly to avoid RLS issues
    let query = supabase
      .from("chats")
      .select("*")
      .eq("user_id", user.id) // Security: ensure user owns the chats
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Add search filter if provided
    if (search.trim()) {
      query = query.ilike("title", `%${search.trim()}%`);
    }

    const { data: chats, error: chatsError } = await query;
    
    if (chatsError) {
      console.error("Error loading chats:", chatsError);
      throw chatsError;
    }

    console.log("Loaded chats:", chats?.length || 0);

    // Get total count for pagination info - use server client directly
    let countQuery = supabase
      .from("chats")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (search.trim()) {
      countQuery = countQuery.ilike("title", `%${search.trim()}%`);
    }

    const { count: totalChats, error: countError } = await countQuery;
    
    if (countError) {
      console.error("Error counting chats:", countError);
      throw countError;
    }

    const totalCount = totalChats || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    console.log("Pagination info:", { totalCount, totalPages, hasNextPage, hasPreviousPage });

    // Format response with additional metadata
    const formattedChats = (chats || []).map((chat) => ({
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
    if (error.message?.includes("permission") || error.message?.includes("policy")) {
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

    // Verify chat exists and belongs to user - use server client directly
    const { data: chat, error: findError } = await supabase
      .from("chats")
      .select("*")
      .eq("id", chatId)
      .eq("user_id", user.id) // Security: ensure user owns the chat
      .single();
      
    if (findError || !chat) {
      console.error("Chat not found or access denied:", findError);
      return NextResponse.json(
        { error: "Conversación no encontrada" },
        { status: 404 }
      );
    }

    // Delete the chat (this will cascade and delete associated messages) - use server client directly
    const { error: deleteError } = await supabase
      .from("chats")
      .delete()
      .eq("id", chatId)
      .eq("user_id", user.id); // Double security check
      
    if (deleteError) {
      console.error("Error deleting chat:", deleteError);
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: "Conversación eliminada exitosamente",
    });

  } catch (error: any) {
    console.error("Error deleting chat:", error);

    // Handle Supabase/database errors
    if (error.message?.includes("permission") || error.message?.includes("policy")) {
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