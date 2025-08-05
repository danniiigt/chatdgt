import { getStaticData } from "@/tolgee/shared";
import { notFound } from "next/navigation";
import { TolgeeNextProvider } from "@/tolgee/client";
import { LOCALE, LOCALES } from "@/lib/constants";
import { Toaster } from "@/components/ui/sonner";
import { AuthHandler } from "@/components/auth/AuthHandler";
import { QueryProvider } from "@/providers/QueryProvider";
import { SupabaseAuthProvider } from "@/providers/SupabaseAuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!LOCALES.includes(locale as LOCALE)) {
    notFound();
  }

  const locales = await getStaticData([locale]);

  return (
    <div>
      <TolgeeNextProvider locales={locales} locale={locale}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseAuthProvider>
            <QueryProvider>
              <AuthHandler />
              {children}
              <Toaster />
            </QueryProvider>
          </SupabaseAuthProvider>
        </ThemeProvider>
      </TolgeeNextProvider>
    </div>
  );
}
