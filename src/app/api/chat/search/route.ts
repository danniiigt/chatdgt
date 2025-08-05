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

    // Get search parameters
    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.trim();
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 20);

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: {
          results: [],
          query: query || "",
        },
      });
    }

    // Try to use RPC function first, but always fall back to basic search
    let searchData = null;
    let isFallback = false;

    try {
      const { data, error } = await supabase.rpc('search_chats_and_messages', {
        user_id: user.id,
        search_query: query,
        result_limit: limit
      });

      if (!error && data) {
        searchData = data;
      } else {
        console.log("RPC function not available or failed, using fallback");
        isFallback = true;
      }
    } catch (rpcError) {
      console.log("RPC function not available, using fallback");
      isFallback = true;
    }

    // Fallback to basic chat title search + basic message search
    if (!searchData || isFallback) {
      // Search in chat titles
      const { data: chatData, error: chatError } = await supabase
        .from("chats")
        .select("id, title, created_at, updated_at")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .ilike("title", `%${query}%`)
        .order("updated_at", { ascending: false })
        .limit(limit);

      if (chatError) {
        throw chatError;
      }

      // Search in message content (basic version)
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          chat_id,
          chats!inner(id, title, updated_at, user_id)
        `)
        .eq("chats.user_id", user.id)
        .eq("chats.is_archived", false)
        .ilike("content", `%${query}%`)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (messageError) {
        console.error("Message search error:", messageError);
      }

      // Combine results
      const titleResults = chatData?.map(chat => ({
        chat_id: chat.id,
        chat_title: chat.title,
        updated_at: chat.updated_at,
        match_type: "title" as const,
        message_preview: null,
        message_id: null
      })) || [];

      const messageResults = messageData?.map(msg => ({
        chat_id: msg.chat_id,
        chat_title: (msg as any).chats.title,
        updated_at: (msg as any).chats.updated_at,
        match_type: "message" as const,
        message_preview: msg.content.length > 150 ? msg.content.substring(0, 150) + '...' : msg.content,
        message_id: msg.id
      })) || [];

      // Remove duplicates and sort by updated_at
      const combinedResults = [...titleResults, ...messageResults];
      const uniqueResults = combinedResults.reduce((acc, current) => {
        const existing = acc.find(item => item.chat_id === current.chat_id);
        if (!existing) {
          acc.push(current);
        } else if (current.match_type === "message" && existing.match_type === "title") {
          // Replace title match with message match if we found a message match
          const index = acc.indexOf(existing);
          acc[index] = current;
        }
        return acc;
      }, [] as typeof combinedResults);

      searchData = uniqueResults
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, limit);

      isFallback = true;
    }

    return NextResponse.json({
      success: true,
      data: {
        results: searchData || [],
        query,
        fallback: isFallback,
      },
    });
  } catch (error: any) {
    console.error("Error searching chats:", error);

    // Handle Supabase/database errors
    if (
      error.message?.includes("permission") ||
      error.message?.includes("policy")
    ) {
      return NextResponse.json(
        { error: "No tienes permisos para buscar conversaciones" },
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