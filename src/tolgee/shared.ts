import { LOCALES } from "@/lib/constants";
import { DevTools, Tolgee, FormatSimple } from "@tolgee/web";

const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

export async function getStaticData(languages: string[]) {
  let finalLanguages = languages.filter((l) => Boolean(l));

  if (!finalLanguages.length || !languages) {
    finalLanguages = LOCALES;
  }

  const result: Record<string, any> = {};
  for (const lang of languages) {
    if (!lang) continue;
    result[lang] = (await import(`../../messages/${lang}.json`)).default;
  }
  return result;
}

export function TolgeeBase() {
  return Tolgee().use(FormatSimple()).use(DevTools()).updateDefaults({
    apiKey,
    apiUrl,
  });
}
