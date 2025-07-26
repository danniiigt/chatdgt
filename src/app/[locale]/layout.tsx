import { getStaticData } from "@/tolgee/shared";
import { notFound } from "next/navigation";
import { TolgeeNextProvider } from "@/tolgee/client";
import { LOCALE, LOCALES } from "@/lib/constants";
import { Toaster } from "@/components/ui/sonner";
import { AuthHandler } from "@/components/auth/AuthHandler";

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
        <AuthHandler />
        {children}
        <Toaster />
      </TolgeeNextProvider>
    </div>
  );
}
