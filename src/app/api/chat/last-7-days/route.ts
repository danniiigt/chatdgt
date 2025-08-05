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

    // Calculate last 7 days date range in UTC
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setUTCDate(now.getUTCDate() - 7);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);
    
    const endOfToday = new Date(now);
    endOfToday.setUTCHours(23, 59, 59, 999);

    // Get pagination parameters
    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);

    // Get last 7 days chats
    const { data, error } = await supabase
      .from("chats")
      .select("id, title, created_at, updated_at")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .gte("updated_at", sevenDaysAgo.toISOString())
      .lte("updated_at", endOfToday.toISOString())
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
          start: sevenDaysAgo.toISOString(),
          end: endOfToday.toISOString(),
        },
      },
    });
  } catch (error: any) {
    console.error("Error loading last 7 days chats:", error);

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