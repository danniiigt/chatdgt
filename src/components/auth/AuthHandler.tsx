"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useTranslate } from "@tolgee/react";

export function AuthHandler() {
  const router = useRouter();
  const supabase = createClientSupabase();
  const { t } = useTranslate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if there are auth tokens in the URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const error = hashParams.get("error");
      const errorDescription = hashParams.get("error_description");
      const type = hashParams.get("type");

      if (error) {
        console.error("Auth error:", error, errorDescription);
        toast.error(
          t(
            "auth.callback.error",
            `Error de autenticación: ${errorDescription || error}`
          )
        );
        // Clean URL and redirect to error page
        window.history.replaceState({}, "", window.location.pathname);
        router.push(`/email-verification-error?error=${encodeURIComponent(errorDescription || error)}`);
        return;
      }

      if (accessToken && type === "signup") {
        try {
          // Exchange the token for a session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error getting session:", error);
            toast.error(
              t(
                "auth.callback.session-error",
                "Error al obtener la sesión. Intenta iniciar sesión de nuevo."
              )
            );
            router.push("/sign-in");
            return;
          }

          if (data.session) {
            // Clean URL
            window.history.replaceState({}, "", window.location.pathname);
            
            // Redirect to email-confirmed page
            router.push("/email-confirmed");
            return;
          }
        } catch (error) {
          console.error("Unexpected error handling auth:", error);
          toast.error(
            t(
              "auth.callback.unexpected-error",
              "Ocurrió un error inesperado. Intenta de nuevo."
            )
          );
        }
      }
    };

    // Only run on the client side and if there's a hash
    if (typeof window !== "undefined" && window.location.hash) {
      handleAuthCallback();
    }
  }, [router, supabase, t]);

  return null; // This component doesn't render anything
}