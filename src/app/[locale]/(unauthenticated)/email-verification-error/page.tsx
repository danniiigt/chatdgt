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
import Link from "next/link";
import { useTranslate } from "@tolgee/react";
import { useSearchParams } from "next/navigation";

export default function EmailVerificationErrorPage() {
  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "unknown";
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <Icons.mail className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tighter">
            {t("auth.email-verification-error.title", "Error de Verificación")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.email-verification-error.description", "Hubo un problema al verificar tu correo electrónico. Es posible que el enlace haya expirado o ya haya sido utilizado.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              {t("auth.email-verification-error.error-details", `Error: ${error}`)}
            </p>
          </div>

          <div className="space-y-3">
            <Button className="w-full" asChild>
              <Link href="/sign-up">
                {t("auth.email-verification-error.try-again", "Intentar Registro de Nuevo")}
              </Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/sign-in">
                {t("auth.email-verification-error.go-to-signin", "Ir a Iniciar Sesión")}
              </Link>
            </Button>

            <Button variant="ghost" className="w-full" asChild>
              <Link href="/">
                {t("auth.email-verification-error.go-home", "Ir al Inicio")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}