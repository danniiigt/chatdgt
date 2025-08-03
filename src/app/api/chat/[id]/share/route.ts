import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabase-server";
import { ChatsServer } from "@/services/Chats";
import { SharedChats } from "@/services/SharedChats";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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

    // Verify chat exists and belongs to user
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

    // Get or create shared chat link
    const sharedChat = await SharedChats.getOrCreateForChat(chatId);

    // Generate the public URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    const shareUrl = `${baseUrl}/share/${sharedChat.share_token}`;

    return NextResponse.json({
      success: true,
      data: {
        shareUrl,
        shareToken: sharedChat.share_token,
        expiresAt: sharedChat.expires_at,
        isActive: sharedChat.is_active,
      },
    });
  } catch (error: any) {
    console.error("Error creating share link:", error);

    // Handle Supabase/database errors
    if (
      error.message?.includes("permission") ||
      error.message?.includes("policy")
    ) {
      return NextResponse.json(
        { error: "No tienes permisos para compartir esta conversación" },
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

    // Verify chat exists and belongs to user
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

    // Deactivate shared chat link
    await SharedChats.deactivate(chatId);

    return NextResponse.json({
      success: true,
      message: "Enlace compartido desactivado",
    });
  } catch (error: any) {
    console.error("Error deactivating share link:", error);

    // Handle Supabase/database errors
    if (
      error.message?.includes("permission") ||
      error.message?.includes("policy")
    ) {
      return NextResponse.json(
        { error: "No tienes permisos para modificar esta conversación" },
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
