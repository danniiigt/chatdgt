"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement signup logic with Supabase
    setTimeout(() => setIsLoading(false), 1000);
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
              type="email"
              placeholder={t("auth.signup.email-placeholder")}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.signup.password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("auth.signup.password-placeholder")}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("auth.signup.confirm-password")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t("auth.signup.confirm-password-placeholder")}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("auth.signup.loading") : t("auth.signup.submit")}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          {t("auth.signup.have-account")}{" "}
          <Link
            prefetch={true}
            href="/sign-in"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t("auth.signup.signin")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
