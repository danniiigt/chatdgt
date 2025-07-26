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

export default function EmailConfirmedPage() {
  const { t } = useTranslate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <Icons.checkCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tighter">
            {t("auth.email-confirmed.title", "¡Correo Verificado!")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.email-confirmed.description", "Tu correo ha sido verificado exitosamente. Ahora puedes iniciar sesión en tu cuenta.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" asChild>
            <Link href="/sign-in">{t("auth.email-confirmed.go-to-signin", "Ir a Iniciar Sesión")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}