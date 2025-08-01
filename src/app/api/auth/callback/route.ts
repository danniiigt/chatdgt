import { createServerSupabase } from "@/lib/supabase/supabase-server";
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");

  // Get the locale from the request headers or use default
  const locale =
    request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
    DEFAULT_LOCALE;

  if (error) {
    console.error("Auth callback error:", error, error_description);
    // Redirect to sign-in with error
    return NextResponse.redirect(
      new URL(
        `/${locale}/sign-in?error=${encodeURIComponent(error_description || error)}`,
        requestUrl.origin
      )
    );
  }

  if (code) {
    try {
      const supabase = await createServerSupabase();

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(
          new URL(`/${locale}/sign-in?error=auth_error`, requestUrl.origin)
        );
      }

      // Successful authentication
      if (data.user) {
        try {
          // Llamar al endpoint de setup para inicializar datos del usuario
          const setupResponse = await fetch(
            `${requestUrl.origin}/api/auth/setup`,
            {
              method: "POST",
              headers: {
                Cookie: request.headers.get("Cookie") || "",
                "Content-Type": "application/json",
              },
            }
          );

          if (!setupResponse.ok) {
            console.error(
              "Error en setup del usuario:",
              await setupResponse.text()
            );
            // No fallar el auth por esto, solo logear el error
          } else {
            const setupData = await setupResponse.json();
            console.log("Usuario configurado exitosamente:", setupData.message);
          }
        } catch (setupError) {
          console.error("Error llamando al endpoint de setup:", setupError);
          // No fallar el auth por esto
        }

        // Redirect to email-confirmed page
        return NextResponse.redirect(
          new URL(`/${locale}/email-confirmed`, requestUrl.origin)
        );
      }

      // Fallback redirect
      return NextResponse.redirect(
        new URL(`/${locale}/chat`, requestUrl.origin)
      );
    } catch (error) {
      console.error("Unexpected error in auth callback:", error);
      return NextResponse.redirect(
        new URL(`/${locale}/sign-in?error=unexpected_error`, requestUrl.origin)
      );
    }
  }

  // No code parameter - redirect to sign-in
  return NextResponse.redirect(
    new URL(`/${locale}/sign-in?error=missing_code`, requestUrl.origin)
  );
}
