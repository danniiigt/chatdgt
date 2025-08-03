"use client";

import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClientSupabase } from "@/lib/supabase/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslate } from "@tolgee/react";
import {
  RESEND_COOLDOWN_SECONDS,
  RESEND_STORAGE_KEY_PREFIX,
} from "@/lib/constants";
import { LoaderCircle } from "lucide-react";

export default function ConfirmEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const supabase = createClientSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { t } = useTranslate();
  const STORAGE_KEY = `${RESEND_STORAGE_KEY_PREFIX}_${email}`;

  // Check if there's a cooldown active or set initial cooldown
  useEffect(() => {
    if (!email) return;

    const lastSentTime = localStorage.getItem(STORAGE_KEY);
    if (lastSentTime) {
      const timeSinceLastSent = Date.now() - parseInt(lastSentTime);
      const remainingTimeMs =
        RESEND_COOLDOWN_SECONDS * 1000 - timeSinceLastSent;

      if (remainingTimeMs > 0) {
        setCanResend(false);
        setCountdown(Math.ceil(remainingTimeMs / 1000));
      }
    } else {
      // Si no hay timestamp previo, significa que es la primera vez que llega después del registro
      // Guardamos el timestamp actual y iniciamos el cooldown
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      setCanResend(false);
      setCountdown(RESEND_COOLDOWN_SECONDS);
    }
  }, [email, STORAGE_KEY]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  // Redirect to sign-in if no email provided
  useEffect(() => {
    if (!email) {
      toast.error(
        t(
          "auth.confirm-email.error.no-email",
          "No se proporcionó email. Redirigiendo a iniciar sesión..."
        )
      );
      router.push("/sign-in");
    }
  }, [email, router, t]);

  if (!email) {
    return null; // Don't render anything while redirecting
  }

  const handleResendEmail = async () => {
    if (!canResend) return;

    setIsResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email!,
      });

      if (error) {
        toast.error(
          t(
            "auth.confirm-email.error.resend-failed",
            "Error al reenviar el correo. Inténtalo de nuevo."
          )
        );
      } else {
        // Save timestamp to localStorage
        localStorage.setItem(STORAGE_KEY, Date.now().toString());

        // Start cooldown
        setCanResend(false);
        setCountdown(RESEND_COOLDOWN_SECONDS);

        toast.success(
          t(
            "auth.confirm-email.success.email-sent",
            "¡Correo de verificación enviado! Revisa tu bandeja de entrada."
          )
        );
      }
    } catch (error) {
      console.error("Error resending email:", error);
      toast.error(
        t("auth.confirm-email.error.unexpected", "Ocurrió un error inesperado.")
      );
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <Icons.mail className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tighter">
            {t("auth.confirm-email.title", "Verifica tu Correo")}
          </CardTitle>
          <CardDescription className="text-center">
            {t(
              "auth.confirm-email.description-part1",
              "Hemos enviado un correo de verificación a"
            )}{" "}
            <strong>{email}</strong>.{" "}
            {t(
              "auth.confirm-email.description-part2",
              "Por favor revisa tu bandeja de entrada y haz clic en el enlace de verificación para acceder a la plataforma."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              {t(
                "auth.confirm-email.no-email",
                "¿No recibiste el correo? Revisa tu carpeta de spam o solicita uno nuevo."
              )}
            </p>
          </div>

          <div className="space-y-3">
            {!canResend && countdown > 0 && (
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  {t(
                    "auth.confirm-email.wait-to-resend",
                    "Puedes reenviar el correo en"
                  )}{" "}
                  <span className="font-mono font-semibold">
                    {formatTime(countdown)}
                  </span>
                </p>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendEmail}
              disabled={isResending || !canResend}
            >
              {isResending && (
                <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isResending ? (
                <>
                  {t("auth.confirm-email.resending", "Enviando...")}
                  <LoaderCircle className="size-4 animate-spin" />
                </>
              ) : !canResend ? (
                t("auth.confirm-email.wait", "Espera para reenviar")
              ) : (
                t(
                  "auth.confirm-email.resend",
                  "Reenviar Correo de Verificación"
                )
              )}
            </Button>

            <Button variant="ghost" className="w-full" asChild>
              <Link href="/sign-in">
                {t(
                  "auth.confirm-email.back-to-signin",
                  "Volver a Iniciar Sesión"
                )}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
