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

    // Calculate today's date range in UTC
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);
    
    const endOfDay = new Date(now);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Get pagination parameters
    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);

    // Get today's chats
    const { data, error } = await supabase
      .from("chats")
      .select("id, title, created_at, updated_at")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .gte("updated_at", startOfDay.toISOString())
      .lte("updated_at", endOfDay.toISOString())
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: {
        chats: data || [],
        count: data?.length || 0,
        date_range: {
          start: startOfDay.toISOString(),
          end: endOfDay.toISOString(),
        },
      },
    });
  } catch (error: any) {
    console.error("Error loading today's chats:", error);

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