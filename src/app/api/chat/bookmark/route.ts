import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { chatId } = await request.json();

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if bookmark already exists
    const { data: existingBookmark } = await supabase
      .from("chat_bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("chat_id", chatId)
      .single();

    if (existingBookmark) {
      // Remove bookmark if it exists
      const { error: deleteError } = await supabase
        .from("chat_bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("chat_id", chatId);

      if (deleteError) {
        console.error("Error removing bookmark:", deleteError);
        return NextResponse.json(
          { error: "Error removing bookmark" },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        bookmarked: false,
        message: "Bookmark removed successfully" 
      });
    } else {
      // Add bookmark if it doesn't exist
      const { error: insertError } = await supabase
        .from("chat_bookmarks")
        .insert({
          user_id: user.id,
          chat_id: chatId,
        });

      if (insertError) {
        console.error("Error adding bookmark:", insertError);
        return NextResponse.json(
          { error: "Error adding bookmark" },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        bookmarked: true,
        message: "Bookmark added successfully" 
      });
    }
  } catch (error) {
    console.error("Error in bookmark route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { data: bookmarkedChats, error } = await supabase
      .from("chat_bookmarks")
      .select(`
        chat_id,
        created_at,
        chats (
          id,
          title,
          created_at,
          updated_at
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookmarked chats:", error);
      return NextResponse.json(
        { error: "Error fetching bookmarked chats" },
        { status: 500 }
      );
    }

    const formattedChats = bookmarkedChats
      ?.map((bookmark: any) => bookmark.chats)
      .filter(Boolean) || [];

    return NextResponse.json({ 
      success: true, 
      chats: formattedChats 
    });
  } catch (error) {
    console.error("Error in bookmark GET route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}