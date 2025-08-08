"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useTranslate } from "@tolgee/react";
import { createClientSupabase } from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInSchema, type SignInFormData } from "@/lib/validations/auth";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { RESEND_STORAGE_KEY_PREFIX } from "@/lib/constants";
import { LoaderCircle } from "lucide-react";

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignInFormData, string>>
  >({});
  const { t } = useTranslate();
  const router = useRouter();
  const supabase = createClientSupabase();

  // Check for auth errors from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");

    if (error) {
      switch (error) {
        case "auth_error":
          toast.error(
            t(
              "auth.signin.error.auth-failed",
              "Error de autenticación. Inténtalo de nuevo."
            )
          );
          break;
        case "unexpected_error":
          toast.error(
            t(
              "auth.signin.error.unexpected",
              "Ocurrió un error inesperado. Inténtalo de nuevo."
            )
          );
          break;
        case "missing_code":
          toast.error(
            t(
              "auth.signin.error.invalid-link",
              "Enlace de autenticación inválido. Intenta iniciar sesión de nuevo."
            )
          );
          break;
        default:
          const decodedError = decodeURIComponent(error);
          toast.error(
            t(
              "auth.signin.error.generic",
              `Error de autenticación: ${decodedError}`
            )
          );
      }

      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when user starts typing
    if (errors[name as keyof SignInFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    try {
      signInSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Partial<Record<keyof SignInFormData, string>> = {};
      error.errors?.forEach((err: any) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof SignInFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Iniciar sesión con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes("Invalid login credentials")) {
          toast.error(
            t(
              "auth.signin.error.invalid-credentials",
              "Email o contraseña incorrectos. Verifica tus credenciales."
            )
          );
        } else if (error.message.includes("Too many requests")) {
          toast.error(
            t(
              "auth.signin.error.too-many-attempts",
              "Demasiados intentos de inicio de sesión. Inténtalo más tarde."
            )
          );
        } else if (
          error.code === "email_not_confirmed" ||
          error.message.includes("Email not confirmed")
        ) {
          // Automatically send verification email when email is not confirmed
          try {
            const { error: resendError } = await supabase.auth.resend({
              type: "signup",
              email: formData.email,
            });

            if (!resendError) {
              // Update timestamp for cooldown
              const storageKey = `${RESEND_STORAGE_KEY_PREFIX}_${formData.email}`;
              localStorage.setItem(storageKey, Date.now().toString());
            } else {
              console.error("Error sending verification email:", resendError);
              toast.error(
                t(
                  "auth.signin.error.verification-send-failed",
                  "Error al enviar el correo de verificación. Inténtalo manualmente."
                )
              );
            }
          } catch (resendError) {
            console.error("Error sending verification email:", resendError);
            toast.error(
              t(
                "auth.signin.error.verification-send-failed",
                "Error al enviar el correo de verificación. Inténtalo manualmente."
              )
            );
          }

          // Redirect to confirmation page
          router.push(
            `/confirm-email?email=${encodeURIComponent(formData.email)}`
          );
        } else {
          toast.error(
            t(
              "auth.signin.error.failed",
              `Error al iniciar sesión: ${error.message}`
            )
          );
        }
        return;
      }

      if (data.user) {
        router.push("/chat");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error during sign in:", error);
      toast.error(
        t(
          "auth.signin.error.unexpected",
          "Ocurrió un error inesperado. Inténtalo de nuevo."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-none shadow-none gap-8">
      <CardHeader className="space-y-0 text-center">
        <CardTitle className="h-fit text-2xl font-semibold tracking-tighter">
          {t("auth.signin.title")}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {t("auth.signin.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.signin.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("auth.signin.email-placeholder")}
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className={cn(
                errors.email && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.signin.password")}</Label>
            <PasswordInput
              id="password"
              name="password"
              placeholder={t("auth.signin.password-placeholder")}
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className={cn(
                errors.password && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                {t("auth.signin.loading", "Cargando")}
                <LoaderCircle className="size-4 animate-spin" />
              </>
            ) : (
              t("auth.signin.submit", "Iniciar Sesión")
            )}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          {t("auth.signin.no-account", "¿No tienes una cuenta?")}{" "}
          <Link
            prefetch={true}
            href="/sign-up"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t("auth.signin.create-account", "Crear Cuenta")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
