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
import { createClientSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { RESEND_STORAGE_KEY_PREFIX } from "@/lib/constants";

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormData, string>>
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
              "auth.signup.error.auth-failed",
              "Error de autenticación. Inténtalo de nuevo."
            )
          );
          break;
        case "unexpected_error":
          toast.error(
            t(
              "auth.signup.error.unexpected",
              "Ocurrió un error inesperado. Inténtalo de nuevo."
            )
          );
          break;
        case "missing_code":
          toast.error(
            t(
              "auth.signup.error.invalid-link",
              "Enlace de autenticación inválido. Intenta registrarte de nuevo."
            )
          );
          break;
        default:
          const decodedError = decodeURIComponent(error);
          toast.error(
            t(
              "auth.signup.error.generic",
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
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);

    // Clear specific field error when user starts typing
    if (errors[name as keyof SignUpFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Real-time validation for password confirmation
    if (
      name === "confirmPassword" ||
      (name === "password" && formData.confirmPassword)
    ) {
      const passwordToCheck =
        name === "password" ? value : newFormData.password;
      const confirmPasswordToCheck =
        name === "confirmPassword" ? value : newFormData.confirmPassword;

      if (
        confirmPasswordToCheck &&
        passwordToCheck !== confirmPasswordToCheck
      ) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords don't match",
        }));
      } else if (
        confirmPasswordToCheck &&
        passwordToCheck === confirmPasswordToCheck
      ) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: undefined,
        }));
      }
    }
  };

  const validateForm = () => {
    try {
      signUpSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Partial<Record<keyof SignUpFormData, string>> = {};
      error.errors?.forEach((err: any) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof SignUpFormData] = err.message;
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
      // Registrar usuario con Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes("already registered")) {
          toast.error(
            t(
              "auth.signup.error.email-exists",
              "Este email ya está registrado. Intenta iniciar sesión."
            )
          );
          setTimeout(() => router.push("/sign-in"), 2000);
        } else if (error.message.includes("Invalid email")) {
          setErrors({ email: "Please enter a valid email address" });
        } else if (error.message.includes("Password")) {
          setErrors({ password: error.message });
        } else {
          toast.error(
            t(
              "auth.signup.error.failed",
              `Error al registrarse: ${error.message}`
            )
          );
        }
        return;
      }

      if (data.user) {
        // Set the resend cooldown timestamp when user successfully registers
        // This prevents immediate resend attempts on the confirmation page
        const storageKey = `${RESEND_STORAGE_KEY_PREFIX}_${formData.email}`;
        localStorage.setItem(storageKey, Date.now().toString());

        router.push(
          `/confirm-email?email=${encodeURIComponent(formData.email)}`
        );
      }
    } catch (error: any) {
      console.error("Error during sign up:", error);
      toast.error(
        t(
          "auth.signup.error.unexpected",
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
          {t("auth.signup.title")}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {t("auth.signup.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.signup.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("auth.signup.email-placeholder")}
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
            <Label htmlFor="password">{t("auth.signup.password")}</Label>
            <PasswordInput
              id="password"
              name="password"
              placeholder={t("auth.signup.password-placeholder")}
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t("auth.signup.confirm-password")}
            </Label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder={t("auth.signup.confirm-password-placeholder")}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className={cn(
                errors.confirmPassword &&
                  "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading
              ? t("auth.signup.loading", "Cargando...")
              : t("auth.signup.submit", "Crear Cuenta")}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          {t("auth.signup.have-account", "¿Ya tienes una cuenta?")}{" "}
          <Link
            prefetch={true}
            href="/sign-in"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t("auth.signup.signin", "Iniciar Sesión")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
